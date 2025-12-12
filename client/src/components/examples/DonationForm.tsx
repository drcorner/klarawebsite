import DonationForm from "../DonationForm";

export default function DonationFormExample() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-cream">
      <DonationForm showFoundingGifts={true} />
    </div>
  );
}
