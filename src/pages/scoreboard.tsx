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
      {scores.map((score) => (
        <ScoreCard key={score.displayName} {...score} />
      ))}
    </Layout>
  );
}
