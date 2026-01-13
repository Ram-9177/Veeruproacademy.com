import { redirect } from "next/navigation";

export default function CourseCheckoutPage({ params }: { params: { courseSlug: string } }) {
  redirect(`/courses/${params.courseSlug}/payment`);
}
