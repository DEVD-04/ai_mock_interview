import { getCurrentUser, getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // --- Normalize categoryScores into an array for the UI ---
  const normalizeCategoryScores = (raw: any) => {
    if (!raw) return [];

    // If it's already an array just return it
    if (Array.isArray(raw)) return raw;

    // If it's an object (named keys), produce an array in the expected order
    if (typeof raw === "object") {
      const orderedNames = [
        "Communication Skills",
        "Technical Knowledge",
        "Problem Solving",
        "Cultural Fit",
        "Confidence and Clarity",
      ];

      const keys = Object.keys(raw);

      return orderedNames.map((name) => {
        // Prefer exact key match
        if (raw[name]) {
          return { name, score: raw[name].score, comment: raw[name].comment };
        }

        // Fallback: try case-insensitive match
        const matchKey = keys.find((k) => k.toLowerCase() === name.toLowerCase());
        if (matchKey) {
          return { name: matchKey, score: raw[matchKey].score, comment: raw[matchKey].comment };
        }

        // More flexible fallback: contains
        const containsKey = keys.find((k) => k.toLowerCase().includes(name.split(" ")[0].toLowerCase()));
        if (containsKey) {
          return { name: containsKey, score: raw[containsKey].score, comment: raw[containsKey].comment };
        }

        // If nothing found, return a placeholder so UI doesn't break
        return { name, score: "N/A", comment: "" };
      });
    }

    // otherwise, empty
    return [];
  };

  const categoryScoresArray = normalizeCategoryScores(feedback?.categoryScores);

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore ?? "N/A"}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment ?? ""}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {categoryScoresArray.map((category: any, index: number) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {(feedback?.strengths ?? []).map((strength: string, index: number) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {(feedback?.areasForImprovement ?? []).map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
