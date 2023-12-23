import { useRouter } from "next/router";

export default function ProgressiView() {
  const router = useRouter();
  const id = router.query.id;
}
