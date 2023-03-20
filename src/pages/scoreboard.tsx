import { useAtom } from "jotai";

// Store
import { scoresAtom } from "@/store/scores";

// Components
import { Layout } from "@/components/Layout";
import { ScoreCard } from "@/components/ScoreCard";

export default function Scoreboard() {
  const [scores] = useAtom(scoresAtom);

  return (
    <Layout title="Scoreboard" mainClass="grid md:grid-cols-3 gap-4">
      {scores.length === 0 && (
        <span className="block text-black/50 md:col-span-3">
          No one has found out about the game yet!
        </span>
      )}

      {scores.map((score) => (
        <ScoreCard key={score.displayName} {...score} />
      ))}
    </Layout>
  );
}
