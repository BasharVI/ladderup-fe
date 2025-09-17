export type Identity = { userId: string; name: string };

function randomName() {
  const animals = [
    "Tiger",
    "Panda",
    "Falcon",
    "Koala",
    "Shark",
    "Eagle",
    "Otter",
    "Wolf",
    "Fox",
    "Lion",
  ];
  return (
    animals[Math.floor(Math.random() * animals.length)] +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

export function getIdentity(): Identity {
  if (typeof window === "undefined") return { userId: "ssr", name: "SSR" };
  let userId = localStorage.getItem("userId");
  let name = localStorage.getItem("displayName");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }
  if (!name) {
    name = randomName();
    localStorage.setItem("displayName", name);
  }
  return { userId, name } as Identity;
}
