import PatientLayout from "../../components/common/PatientLayout";
import MoodCheckIn from "../../components/patient/MoodCheckIn";
import CalmMoment from "../../components/patient/CalmMoment";

export default function PatientMood() {
  return (
    <PatientLayout title="Mood check-in" subtitle="A gentle daily note for you and your caregiver.">
      <div className="space-y-6"><MoodCheckIn /><CalmMoment /></div>
    </PatientLayout>
  );
}
