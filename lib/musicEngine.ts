import { Howl, Howler } from "howler";

const SRC = encodeURI("/Anemone Symphony.mp3");

let howl: Howl | null = null;
let userPaused = false;

function getHowl(): Howl {
  if (howl) return howl;

  howl = new Howl({
    src: [SRC],
    loop: true,
    volume: 0.6,
    preload: true,
    autoplay: true,
    onplayerror: () => {
      howl?.once("unlock", () => {
        if (!userPaused) {
          resumeAndPlay();
        }
      });
    },
  });

  return howl;
}

export function resumeAndPlay() {
  const sound = getHowl();
  try {
    Howler.mute(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ctx = Howler.ctx as AudioContext | undefined;
    if (ctx?.state === "suspended") {
      void ctx.resume();
    }
  } catch {}

  if (!userPaused && !sound.playing()) {
    sound.play();
  }
}

export function pauseMusic() {
  userPaused = true;
  howl?.pause();
}

export function resumeMusic() {
  userPaused = false;
  resumeAndPlay();
}

export function isMusicPlaying(): boolean {
  return howl?.playing() ?? false;
}

export function resetMusicAfterClear() {
  userPaused = false;
  howl?.stop();
  resumeAndPlay();
}

export function bindMusicUnlockListeners() {
  if (typeof document === "undefined") return () => {};

  const onInteraction = () => {
    if (!userPaused) {
      resumeAndPlay();
    }
  };

  document.addEventListener("pointerdown", onInteraction, true);
  document.addEventListener("keydown", onInteraction, true);

  return () => {
    document.removeEventListener("pointerdown", onInteraction, true);
    document.removeEventListener("keydown", onInteraction, true);
  };
}

// Start loading immediately when this module is imported.
if (typeof window !== "undefined") {
  const sound = getHowl();
  sound.once("load", resumeAndPlay);
  sound.once("unlock", resumeAndPlay);
  if (sound.state() === "loaded") {
    resumeAndPlay();
  } else {
    sound.load();
  }
  bindMusicUnlockListeners();
}
