import { FiEdit3, FiUser, FiX } from "react-icons/fi";
import { PiCarProfile } from "react-icons/pi";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  { title: "Create Account", description: "Sign up and verify your account.", icon: FiUser },
  { title: "Add Your Car", description: "Post your car with details and photos.", icon: PiCarProfile },
  { title: "Get Offers", description: "Receive inquiries from interested buyers.", icon: FiEdit3 },
  { title: "Sell Your Car", description: "Close the deal and get paid securely.", icon: FiX },
];

export function HowItWorks() {
  return (
    <section className="pb-20 pt-10 sm:pb-24" id="how-it-works">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <SectionHeading title="How It Works" />
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-slate-200 lg:block" aria-hidden="true" />
          {steps.map(({ title, description, icon: Icon }, index) => (
            <div className="relative text-center" key={title}>
              <div className="relative z-10 mx-auto grid size-14 place-items-center rounded-full bg-slate-100 text-xl text-primary ring-8 ring-white"><Icon aria-hidden="true" /></div>
              <h3 className="mt-6 text-sm font-bold"><span className="mr-1">{index + 1}.</span>{title}</h3>
              <p className="mx-auto mt-3 max-w-[190px] text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
