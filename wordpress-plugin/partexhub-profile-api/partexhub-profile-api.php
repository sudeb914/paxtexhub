<?php
/**
 * Plugin Name: PartexHub Seller Profile API
 * Description: Secure current-user profile REST endpoints for the AutoHub frontend.
 * Version: 1.3.0
 * Author: PartexHub
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

const PARTEXHUB_PROFILE_META = array(
	'phone', 'company_name', 'business_type', 'website', 'bio', 'country', 'city',
	'zip_code', 'street_address', 'facebook', 'instagram', 'linkedin', 'youtube',
	'email_notifications', 'marketing_emails', 'phone_number_public', 'profile_picture',
);

add_action( 'init', function () {
	foreach ( PARTEXHUB_PROFILE_META as $key ) {
		register_user_meta( 'user', $key, array(
			'type' => 'string', 'single' => true, 'show_in_rest' => true,
			'auth_callback' => function () { return is_user_logged_in(); },
			'sanitize_callback' => 'sanitize_text_field',
		) );
	}
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'partexhub/v1', '/token/revoke', array(
		'methods' => WP_REST_Server::CREATABLE,
		'callback' => 'partexhub_revoke_current_token',
		'permission_callback' => function () { return get_current_user_id() > 0; },
	) );
	register_rest_route( 'partexhub/v1', '/profile', array(
		array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => 'partexhub_get_profile',
			'permission_callback' => function () { return get_current_user_id() > 0; },
		),
		array(
			'methods' => WP_REST_Server::EDITABLE,
			'callback' => 'partexhub_update_profile',
			'permission_callback' => function () { return get_current_user_id() > 0; },
		),
	) );
	register_rest_route( 'partexhub/v1', '/listings/(?P<id>\d+)', array(
		'methods' => WP_REST_Server::EDITABLE,
		'callback' => 'partexhub_update_owned_listing',
		'permission_callback' => 'partexhub_can_update_owned_listing',
		'args' => array( 'id' => array( 'required' => true, 'sanitize_callback' => 'absint' ) ),
	) );
} );

function partexhub_bearer_token() {
	$header = isset( $_SERVER['HTTP_AUTHORIZATION'] ) ? trim( wp_unslash( $_SERVER['HTTP_AUTHORIZATION'] ) ) : '';
	if ( ! preg_match( '/^Bearer\s+(\S+)$/i', $header, $matches ) ) return '';
	return $matches[1];
}

function partexhub_revoked_token_key( $token ) {
	return 'partexhub_revoked_' . hash( 'sha256', $token );
}

function partexhub_revoke_current_token() {
	$token = partexhub_bearer_token();
	if ( ! $token ) return new WP_Error( 'missing_token', 'Authorization token not found.', array( 'status' => 401 ) );
	set_site_transient( partexhub_revoked_token_key( $token ), 1, 7 * DAY_IN_SECONDS );
	return rest_ensure_response( array( 'success' => true ) );
}

add_filter( 'rest_authentication_errors', function ( $result ) {
	if ( is_wp_error( $result ) ) return $result;
	$token = partexhub_bearer_token();
	if ( $token && get_site_transient( partexhub_revoked_token_key( $token ) ) ) {
		return new WP_Error( 'jwt_auth_revoked_token', 'The token has been revoked.', array( 'status' => 401 ) );
	}
	return $result;
}, 20 );

function partexhub_can_update_owned_listing( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$post = get_post( absint( $request['id'] ) );
	return $user_id > 0 && $post && 'car-listing' === $post->post_type && (int) $post->post_author === $user_id;
}

function partexhub_update_owned_listing( WP_REST_Request $request ) {
	$post_id = absint( $request['id'] );
	$title = sanitize_text_field( $request->get_param( 'title' ) );
	$content = wp_kses_post( $request->get_param( 'content' ) );
	if ( strlen( $title ) < 3 || strlen( $title ) > 150 ) return new WP_Error( 'invalid_title', 'Enter a valid listing title.', array( 'status' => 400 ) );
	if ( strlen( wp_strip_all_tags( $content ) ) < 10 ) return new WP_Error( 'invalid_content', 'Enter a valid listing description.', array( 'status' => 400 ) );

	$brand = array_map( 'absint', (array) $request->get_param( 'brand' ) );
	$car_type = array_map( 'absint', (array) $request->get_param( 'car-type' ) );
	$location_terms = array_map( 'absint', (array) $request->get_param( 'location' ) );
	if ( empty( $brand[0] ) || empty( $car_type[0] ) || empty( $location_terms[0] ) ) return new WP_Error( 'invalid_taxonomy', 'Select valid listing categories.', array( 'status' => 400 ) );

	$featured_media = absint( $request->get_param( 'featured_media' ) );
	if ( $featured_media && 'attachment' !== get_post_type( $featured_media ) ) return new WP_Error( 'invalid_media', 'Invalid featured image.', array( 'status' => 400 ) );
	$meta = (array) $request->get_param( 'meta' );
	$gallery = array_values( array_filter( array_map( 'absint', isset( $meta['gallery'] ) ? (array) $meta['gallery'] : array() ) ) );
	foreach ( $gallery as $attachment_id ) if ( 'attachment' !== get_post_type( $attachment_id ) ) return new WP_Error( 'invalid_gallery', 'Invalid gallery image.', array( 'status' => 400 ) );

	$result = wp_update_post( array( 'ID' => $post_id, 'post_title' => $title, 'post_content' => $content, 'post_status' => 'pending' ), true );
	if ( is_wp_error( $result ) ) return $result;
	if ( $featured_media ) set_post_thumbnail( $post_id, $featured_media ); else delete_post_thumbnail( $post_id );
	wp_set_object_terms( $post_id, $brand, 'brand', false );
	wp_set_object_terms( $post_id, $car_type, 'car-type', false );
	wp_set_object_terms( $post_id, $location_terms, 'location', false );

	update_post_meta( $post_id, 'model', sanitize_text_field( isset( $meta['model'] ) ? $meta['model'] : '' ) );
	update_post_meta( $post_id, 'year', (string) absint( isset( $meta['year'] ) ? $meta['year'] : 0 ) );
	update_post_meta( $post_id, 'price', (string) max( 0, floatval( isset( $meta['price'] ) ? $meta['price'] : 0 ) ) );
	update_post_meta( $post_id, 'mileage', (string) max( 0, floatval( isset( $meta['mileage'] ) ? $meta['mileage'] : 0 ) ) );
	update_post_meta( $post_id, 'location', sanitize_text_field( isset( $meta['location'] ) ? $meta['location'] : '' ) );
	update_post_meta( $post_id, 'gallery', array_map( 'strval', $gallery ) );

	return rest_ensure_response( array(
		'id' => $post_id,
		'status' => 'pending',
		'slug' => get_post_field( 'post_name', $post_id ),
		'title' => array( 'rendered' => get_the_title( $post_id ) ),
	) );
}

function partexhub_profile_payload( $user_id ) {
	$user = get_userdata( $user_id );
	$photo_id = absint( get_user_meta( $user_id, 'profile_picture', true ) );
	if ( ! $photo_id ) $photo_id = absint( get_user_meta( $user_id, 'profile_photo', true ) );
	return array(
		'id' => $user_id,
		'username' => $user->user_login,
		'first_name' => $user->first_name,
		'last_name' => $user->last_name,
		'display_name' => $user->display_name,
		'email' => $user->user_email,
		'phone' => (string) get_user_meta( $user_id, 'phone', true ),
		'company_name' => (string) get_user_meta( $user_id, 'company_name', true ),
		'business_type' => (string) get_user_meta( $user_id, 'business_type', true ),
		'website' => (string) get_user_meta( $user_id, 'website', true ),
		'bio' => (string) get_user_meta( $user_id, 'bio', true ),
		'country' => (string) get_user_meta( $user_id, 'country', true ),
		'city' => (string) get_user_meta( $user_id, 'city', true ),
		'zip_code' => (string) get_user_meta( $user_id, 'zip_code', true ),
		'street_address' => (string) get_user_meta( $user_id, 'street_address', true ),
		'facebook' => (string) get_user_meta( $user_id, 'facebook', true ),
		'instagram' => (string) get_user_meta( $user_id, 'instagram', true ),
		'linkedin' => (string) get_user_meta( $user_id, 'linkedin', true ),
		'youtube' => (string) get_user_meta( $user_id, 'youtube', true ),
		'email_notifications' => (string) get_user_meta( $user_id, 'email_notifications', true ),
		'marketing_emails' => (string) get_user_meta( $user_id, 'marketing_emails', true ),
		'phone_number_public' => (string) get_user_meta( $user_id, 'phone_number_public', true ),
		'profile_picture' => $photo_id ?: '',
		'profilePictureUrl' => $photo_id ? wp_get_attachment_image_url( $photo_id, 'full' ) : '',
	);
}

function partexhub_get_profile() {
	return rest_ensure_response( partexhub_profile_payload( get_current_user_id() ) );
}

function partexhub_update_profile( WP_REST_Request $request ) {
	$user_id = get_current_user_id();
	$allowed_business_types = array( '', 'car-dealer', 'dealership', 'broker' );
	$business_type = sanitize_key( $request->get_param( 'business_type' ) );
	if ( ! in_array( $business_type, $allowed_business_types, true ) ) {
		return new WP_Error( 'invalid_business_type', 'Invalid business type.', array( 'status' => 400 ) );
	}
	$email = sanitize_email( $request->get_param( 'email' ) );
	if ( ! is_email( $email ) ) return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
	$display_name = sanitize_text_field( $request->get_param( 'display_name' ) );
	if ( '' === $display_name ) return new WP_Error( 'invalid_display_name', 'Display name is required.', array( 'status' => 400 ) );

	$result = wp_update_user( array(
		'ID' => $user_id,
		'first_name' => sanitize_text_field( $request->get_param( 'first_name' ) ),
		'last_name' => sanitize_text_field( $request->get_param( 'last_name' ) ),
		'display_name' => $display_name,
		'user_email' => $email,
	) );
	if ( is_wp_error( $result ) ) return $result;

	$text_fields = array( 'phone', 'company_name', 'country', 'city', 'zip_code', 'street_address' );
	foreach ( $text_fields as $key ) update_user_meta( $user_id, $key, sanitize_text_field( $request->get_param( $key ) ) );
	update_user_meta( $user_id, 'business_type', $business_type );
	update_user_meta( $user_id, 'bio', sanitize_textarea_field( $request->get_param( 'bio' ) ) );
	foreach ( array( 'website', 'facebook', 'instagram', 'linkedin', 'youtube' ) as $key ) {
		$value = trim( (string) $request->get_param( $key ) );
		if ( $value && ! wp_http_validate_url( $value ) ) return new WP_Error( 'invalid_url', sprintf( 'Invalid %s URL.', $key ), array( 'status' => 400 ) );
		update_user_meta( $user_id, $key, esc_url_raw( $value ) );
	}
	foreach ( array( 'email_notifications', 'marketing_emails', 'phone_number_public' ) as $key ) {
		$value = $request->get_param( $key );
		update_user_meta( $user_id, $key, 'yes' === $value ? 'yes' : 'no' );
	}
	$photo_id = absint( $request->get_param( 'profile_picture' ) );
	if ( $photo_id && 'attachment' !== get_post_type( $photo_id ) ) return new WP_Error( 'invalid_profile_photo', 'Invalid profile photo.', array( 'status' => 400 ) );
	update_user_meta( $user_id, 'profile_picture', $photo_id ?: '' );

	return rest_ensure_response( partexhub_profile_payload( $user_id ) );
}
