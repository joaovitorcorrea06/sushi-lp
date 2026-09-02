import { Suspense, lazy, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Clock3,
  MapPin,
  MessageCircle,
  PhoneCall,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import Galaxy from "@/components/background/Galaxy";
import { Button } from "@/components/ui/button";
import { landingContent } from "@/config/landing-content";
import { cn } from "@/lib/utils";

const HeroScene = lazy(async () => {
  const module = await import("@/features/hero/HeroScene");
  return { default: module.HeroScene };
});

function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)] backdrop-blur-xl">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  body,
  align = "left",
}) {
  return (
    <div className={cn("max-w-3xl space-y-5", align === "center" && "mx-auto text-center")}>
      <h2 className="font-display text-4xl leading-[0.95] text-[var(--color-cream)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-white/66 sm:text-lg">{body}</p>
    </div>
  );
}

function FadeBlock({
  children,
  delay = 0,
  className,
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
      whileInView={
        reducedMotion
          ? undefined
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroSceneFallback() {
  return (
    <div className="relative h-full min-h-[19rem] w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),rgba(244,155,56,0.42)_45%,rgba(0,0,0,0.15)_100%)] blur-[1px]" />
      <div className="absolute bottom-7 left-0 text-[0.64rem] uppercase tracking-[0.28em] text-white/45">
        Preparando cena 3D
      </div>
    </div>
  );
}

function BrandSignature({ label, compact = false }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "gap-2.5")}>
      <div
        aria-hidden="true"
        className={cn(
          "grid place-items-center rounded-xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(244,155,56,0.14))] text-[var(--color-accent)] shadow-[0_12px_30px_rgba(0,0,0,0.28)]",
          compact ? "size-[2.125rem]" : "size-10",
        )}
      >
        <Sparkles className={cn("opacity-90", compact ? "size-3.5" : "size-4")} />
      </div>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-white/42">
        {label}
      </p>
    </div>
  );
}

function StoryBackdrop({
  reducedMotion,
  className,
  variant = "hero",
}) {
  const isHero = variant === "hero";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[#050607]" />
      {isHero ? (
        <Galaxy
          className="absolute inset-0 opacity-[0.5]"
          disableAnimation={Boolean(reducedMotion)}
          mouseInteraction={false}
          mouseRepulsion={false}
          density={0.92}
          glowIntensity={0.38}
          twinkleIntensity={0.1}
          speed={0.38}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0",
          isHero
            ? "bg-[radial-gradient(circle_at_12%_18%,rgba(244,155,56,0.17),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.04),transparent_18%),radial-gradient(circle_at_74%_74%,rgba(244,155,56,0.09),transparent_24%)]"
            : "bg-[radial-gradient(circle_at_14%_18%,rgba(244,155,56,0.14),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(244,155,56,0.08),transparent_20%),radial-gradient(circle_at_78%_62%,rgba(255,255,255,0.035),transparent_18%),radial-gradient(circle_at_48%_86%,rgba(244,155,56,0.1),transparent_24%)]",
        )}
      />
      {!isHero ? (
        <>
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:10rem_10rem]" />
          <div className="absolute inset-y-0 left-[12%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-y-0 right-[18%] w-px bg-gradient-to-b from-transparent via-[rgba(244,155,56,0.14)] to-transparent" />
          <div className="absolute left-[8%] top-[18%] h-56 w-56 rounded-full bg-[rgba(244,155,56,0.08)] blur-3xl" />
          <div className="absolute bottom-[14%] right-[12%] h-72 w-72 rounded-full bg-[rgba(244,155,56,0.08)] blur-3xl" />
        </>
      ) : null}
      <div
        className={cn(
          "absolute inset-0",
          isHero
            ? "bg-[linear-gradient(180deg,rgba(3,4,5,0.44)_0%,rgba(3,4,5,0.16)_18%,rgba(3,4,5,0.1)_72%,rgba(3,4,5,0.52)_100%)]"
            : "bg-[linear-gradient(180deg,rgba(3,4,5,0.72)_0%,rgba(3,4,5,0.42)_24%,rgba(3,4,5,0.3)_72%,rgba(3,4,5,0.68)_100%)]",
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_16%,rgba(2,3,4,0.12)_60%,rgba(2,3,4,0.4)_100%)]" />
    </div>
  );
}

function getAnchorProps(href) {
  return href.startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" };
}

function SequenceFeatureCard({
  feature,
  align = "left",
  className,
  visual,
}) {
  const visualSlot = visual ? (
    <div className="relative h-[20rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,155,56,0.08),transparent_54%)] blur-3xl" />
      <div className="absolute inset-x-[8%] bottom-2">
        <img
          src={visual.image}
          alt={visual.alt}
          className="mx-auto w-full max-w-[34rem] opacity-95"
        />
      </div>
      <div className="absolute inset-x-[20%] bottom-10 h-10 rounded-full bg-[rgba(244,155,56,0.08)] blur-3xl" />
    </div>
  ) : (
    <div aria-hidden className="h-[18rem]" />
  );

  const card = (
    <div className="relative z-20 max-w-[35rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] px-7 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,155,56,0.12),transparent_28%)]" />
      <div className="relative space-y-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-white/36">
          {feature.stat}
        </p>
        <h3 className="max-w-[14ch] font-display text-[2.3rem] leading-[0.94] tracking-[-0.04em] text-[var(--color-cream)]">
          {feature.title}
        </h3>
        <p className="max-w-[30rem] text-[0.98rem] leading-8 text-white/68">
          {feature.description}
        </p>
        <div className="grid gap-3 border-t border-white/8 pt-5 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-white/8 bg-black/16 px-4 py-4">
            <p className="text-[0.64rem] uppercase tracking-[0.26em] text-white/38">
              {feature.detailPrimaryLabel}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/58">{feature.detailPrimaryText}</p>
          </div>
          <div className="rounded-[1.2rem] border border-[rgba(244,155,56,0.18)] bg-[rgba(244,155,56,0.06)] px-4 py-4">
            <p className="text-[0.64rem] uppercase tracking-[0.26em] text-[var(--color-accent)]/80">
              {feature.detailSecondaryLabel}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/72">{feature.detailSecondaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "grid w-full grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] items-center gap-12",
        align === "right" && "grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]",
        className,
      )}
    >
      {align === "left" ? (
        <>
          {card}
          {visualSlot}
        </>
      ) : (
        <>
          {visualSlot}
          <div className="ml-auto">{card}</div>
        </>
      )}
    </div>
  );
}

export function LandingPage() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const storyRef = useRef(null);
  const mobileHeroRef = useRef(null);
  const sequenceRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const content = landingContent;
  const primaryCtaProps = getAnchorProps(content.primaryCta.href);
  const contactWhatsappProps = getAnchorProps(content.contact.whatsappHref);
  const contactMapsProps = getAnchorProps(content.contact.mapsHref);

  const menuCards = useMemo(() => content.signatureMenu, [content.signatureMenu]);

  const handleExploreSequence = () => {
    if (typeof window === "undefined") {
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const desktopTarget = sequenceRef.current;
    const mobileTarget = document.getElementById("sequencia-mobile");
    const target = isDesktop ? desktopTarget : mobileTarget;

    if (!target) {
      return;
    }

    const top = isDesktop
      ? target.offsetTop + window.innerHeight * 0.18
      : target.offsetTop;

    window.scrollTo({
      top,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#040506_0%,#090b0e_46%,#050607_100%)]" />
        <div className="absolute inset-x-[14%] top-[-10%] h-[34rem] bg-[radial-gradient(circle_at_center,rgba(244,155,56,0.16),transparent_58%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.015)_54%,transparent_100%)] opacity-40" />
      </div>

      <div ref={storyRef} className="relative hidden lg:block">
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="sticky top-0 h-screen max-h-[100svh] overflow-visible">
            <div className="relative h-full w-full overflow-visible">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(244,155,56,0.18),transparent_24%),radial-gradient(circle_at_24%_72%,rgba(244,155,56,0.12),transparent_24%),radial-gradient(circle_at_44%_78%,rgba(255,255,255,0.04),transparent_18%)] blur-3xl" />
              <Suspense fallback={<HeroSceneFallback />}>
                <HeroScene config={content.storyScene} pinRef={storyRef} />
              </Suspense>
            </div>
          </div>
        </div>

        <section className="relative isolate min-h-[165vh]">
          <div className="sticky top-0 h-screen max-h-[100svh] overflow-hidden">
            <StoryBackdrop reducedMotion={reducedMotion} className="-z-20" variant="hero" />

            <div className="relative z-20 mx-auto flex h-full w-full max-w-7xl items-center px-10">
              <FadeBlock className="max-w-[43rem] space-y-9">
                <div className="space-y-5">
                  {/* <SectionEyebrow>{content.eyebrow}</SectionEyebrow> */}
                  <div className="space-y-6">
                    <BrandSignature label={content.brand} />
                    <h1 className="max-w-[12ch] text-balance font-display text-[clamp(4rem,6.25vw,6.8rem)] leading-[0.88] tracking-[-0.05em] text-[var(--color-cream)]">
                      {content.heroTitle}
                    </h1>
                    <p className="max-w-[34rem] text-[1.02rem] leading-8 text-white/68">
                      {content.heroBody}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                      <a href={content.primaryCta.href} {...primaryCtaProps}>
                        <MessageCircle className="size-4" />
                        {content.primaryCta.label}
                      </a>
                    </Button>
                    <Button type="button" variant="secondary" size="lg" onClick={handleExploreSequence}>
                      {content.secondaryCta.label}
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>

                  {/* <div className="grid max-w-[52rem] gap-4 border-t border-white/10 pt-6 text-[0.72rem] uppercase tracking-[0.26em] text-white/42 xl:grid-cols-3">
                    {content.proofItems.slice(0, 3).map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        <p className="flex flex-wrap items-baseline gap-2 leading-6">
                          <span>{item.label}</span>
                          <span className="text-[0.98rem] font-medium normal-case tracking-normal text-[var(--color-cream)]">
                            {item.value}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div> */}
                </div>
              </FadeBlock>

              {/* <div className="pointer-events-none absolute bottom-5 left-[max(2.5rem,calc((100vw-80rem)/2))] z-20 text-[0.58rem] uppercase tracking-[0.34em] text-white/42">
                Scroll para a sequencia
              </div> */}
            </div>
          </div>
        </section>

        <section
          ref={sequenceRef}
          id="sequencia"
          className="relative py-14"
        >
          <StoryBackdrop reducedMotion={reducedMotion} className="z-0" variant="section" />

          <div className="relative z-20 mx-auto w-full max-w-7xl px-10">
            {/* <div className="mb-8 flex items-center justify-between">
              <SectionEyebrow>Sequencia premium</SectionEyebrow>
              <div className="pointer-events-none text-[0.58rem] uppercase tracking-[0.34em] text-white/38">
                Scroll para acompanhar a sequencia
              </div>
            </div> */}

            <div className="space-y-8 pb-24">
              {content.sequenceHighlights.map((highlight, index) => (
                <div key={highlight.title} className="flex min-h-[56vh] items-center">
                  <SequenceFeatureCard
                    feature={highlight}
                    align={index % 2 === 0 ? "right" : "left"}
                    className="gap-10"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="relative lg:hidden">
        <div ref={mobileHeroRef} className="relative min-h-screen overflow-hidden">
          <StoryBackdrop reducedMotion={reducedMotion} className="-z-20" variant="hero" />

          <div className="relative z-10 px-5 pb-12 pt-20 sm:px-8">
            <FadeBlock className="max-w-[34rem] space-y-8">
              <div className="space-y-5">
                <SectionEyebrow>{content.eyebrow}</SectionEyebrow>
                <div className="space-y-5">
                  <BrandSignature label={content.brand} compact />
                  <h1 className="max-w-[11ch] text-balance font-display text-[clamp(3.2rem,12vw,5rem)] leading-[0.9] tracking-[-0.05em] text-[var(--color-cream)]">
                    {content.heroTitle}
                  </h1>
                  <p className="max-w-[32rem] text-base leading-8 text-white/68">
                    {content.heroBody}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href={content.primaryCta.href} {...primaryCtaProps}>
                    <MessageCircle className="size-4" />
                    {content.primaryCta.label}
                  </a>
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={handleExploreSequence}>
                  {content.secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </FadeBlock>

            <div className="relative mt-10 h-[38vh] min-h-[18rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_38%,rgba(244,155,56,0.22),transparent_24%),radial-gradient(circle_at_42%_76%,rgba(255,255,255,0.04),transparent_18%)] blur-3xl" />
              <Suspense fallback={<HeroSceneFallback />}>
                <HeroScene config={content.heroScene} pinRef={mobileHeroRef} />
              </Suspense>
            </div>

            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-[0.72rem] uppercase tracking-[0.24em] text-white/42 sm:grid-cols-3">
              {content.proofItems.slice(0, 3).map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  <p className="flex flex-wrap items-baseline gap-2 leading-6">
                    <span>{item.label}</span>
                    <span className="text-sm font-medium normal-case tracking-normal text-[var(--color-cream)]">
                      {item.value}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="sequencia-mobile" className="relative px-5 py-16 sm:px-8 lg:hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_18%,rgba(244,155,56,0.08),transparent_26%)]" />

        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center justify-between gap-4">
            <SectionEyebrow>Sequencia premium</SectionEyebrow>
            <span className="text-[0.58rem] uppercase tracking-[0.3em] text-white/38">
              Cards em leitura direta
            </span>
          </div>

          <div className="grid gap-5">
            {content.sequenceHighlights.map((highlight, index) => (
              <FadeBlock
                key={highlight.title}
                delay={index * 0.08}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-6 backdrop-blur-xl"
              >
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/38">
                  {highlight.stat}
                </p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-[var(--color-cream)]">
                  {highlight.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{highlight.description}</p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[1.2rem] border border-white/8 bg-black/18 px-4 py-4">
                    <p className="text-[0.64rem] uppercase tracking-[0.26em] text-white/36">
                      {highlight.detailPrimaryLabel}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/60">{highlight.detailPrimaryText}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(244,155,56,0.18)] bg-[rgba(244,155,56,0.06)] px-4 py-4">
                    <p className="text-[0.64rem] uppercase tracking-[0.26em] text-[var(--color-accent)]/80">
                      {highlight.detailSecondaryLabel}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/72">{highlight.detailSecondaryText}</p>
                  </div>
                </div>
              </FadeBlock>
            ))}
          </div>

          <FadeBlock delay={0.2}>
            <Button asChild size="lg">
              <a href={content.primaryCta.href} {...primaryCtaProps}>
                <MessageCircle className="size-4" />
                {content.primaryCta.label}
              </a>
            </Button>
          </FadeBlock>
        </div>
      </section>

      {/* <section className="relative z-10 px-5 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <FadeBlock className="space-y-6">
            <SectionEyebrow>Destaques do cardapio</SectionEyebrow>
            <SectionTitle
              title="Assinaturas visuais com textura, brilho e volume controlado."
              body="O bloco de menu usa composicoes com profundidade e alternancia de foco para valorizar pecas icônicas sem competir com a hero."
            />
          </FadeBlock>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <FadeBlock className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl md:p-6">
              <div className="flex items-center gap-3 pb-4">
                {menuCards.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveMenuIndex(index)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300",
                      activeMenuIndex === index
                        ? "border-[var(--color-accent)] bg-[rgba(244,155,56,0.14)] text-[var(--color-accent)]"
                        : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:text-white/70",
                    )}
                  >
                    {item.note}
                  </button>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/25 p-4 md:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,155,56,0.16),transparent_26%)]" />
                <motion.div
                  key={menuCards[activeMenuIndex].title}
                  initial={{ opacity: 0, rotateY: -10, y: 16 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-center"
                >
                  <div
                    className="perspective-[1600px] relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-3"
                    style={{ perspective: "1600px" }}
                  >
                    <div className="absolute inset-5 rounded-[1.55rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_70%_70%,rgba(244,155,56,0.18),transparent_30%),#101115]" />
                    <img
                      src={menuCards[activeMenuIndex].image.src}
                      alt={menuCards[activeMenuIndex].image.alt}
                      className="relative z-10 h-full w-full rounded-[1.35rem] object-cover shadow-[0_30px_70px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/40">
                      {menuCards[activeMenuIndex].note}
                    </p>
                    <h3 className="font-display text-4xl text-[var(--color-cream)]">
                      {menuCards[activeMenuIndex].title}
                    </h3>
                    <p className="text-sm leading-7 text-white/68">
                      {menuCards[activeMenuIndex].description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </FadeBlock>

            <div className="grid gap-5">
              {menuCards.map((item, index) => (
                <FadeBlock
                  key={item.title}
                  delay={index * 0.08}
                  className={cn(
                    "rounded-[1.75rem] border p-5 backdrop-blur-xl transition-all duration-300",
                    activeMenuIndex === index
                      ? "border-[rgba(244,155,56,0.35)] bg-[rgba(244,155,56,0.08)]"
                      : "border-white/10 bg-white/[0.035]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenuIndex(index)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <div className="space-y-3">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/38">
                        {item.note}
                      </p>
                      <h3 className="text-lg font-semibold text-[var(--color-cream)]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-7 text-white/64">{item.description}</p>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--color-accent)]" />
                  </button>
                </FadeBlock>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <FadeBlock className="space-y-6">
            <SectionEyebrow>Ambiente e ocasiao</SectionEyebrow>
            <SectionTitle
              title="Luxo noturno, mesa bem iluminada e uma sensacao de destino para a noite."
              body="Aqui o discurso visual muda de prato para experiencia: lounge, luz, mesa posta e pequenos rituais de servico que justificam a reserva como programa."
            />
          </FadeBlock>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <FadeBlock className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl md:p-6">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                {content.ambienceGallery.slice(0, 2).map((asset, index) => (
                  <div
                    key={asset.src}
                    className={cn(
                      "overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20",
                      index === 0 ? "md:row-span-2" : "aspect-[4/3]",
                    )}
                  >
                    <img
                      src={asset.src}
                      alt={asset.alt}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                ))}
                <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6">
                  <p className="font-display text-4xl leading-none text-[var(--color-cream)]">
                    Atmosfera com leitura de quiet luxury.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    O visual e controlado, quente e intencional. Em vez de excessos, a pagina trabalha contraste, profundidade e materiais escuros para reforcar exclusividade.
                  </p>
                </div>
              </div>
            </FadeBlock>

            <div className="grid gap-5">
              <FadeBlock className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <img
                  src={content.ambienceGallery[2].src}
                  alt={content.ambienceGallery[2].alt}
                  className="h-60 w-full rounded-[1.65rem] object-cover"
                />
                <div className="mt-5 space-y-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/40">
                    Ocasioes especiais
                  </p>
                  <p className="text-sm leading-7 text-white/68">
                    Jantar a dois, celebracoes discretas e encontros em que o ambiente precisa parecer alinhado com a importancia da noite.
                  </p>
                </div>
              </FadeBlock>

              <FadeBlock className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/40">
                  Layer de motion
                </p>
                <div className="mt-4 grid gap-4">
                  {[
                    "Textos entram com blur-reveal discreto",
                    "Cards revelam com profundidade e atraso curto",
                    "A hero segura o wow factor principal da pagina",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.4rem] border border-white/8 bg-black/20 px-4 py-4 text-sm text-white/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </FadeBlock>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <FadeBlock className="space-y-6">
            <SectionEyebrow>Depoimentos</SectionEyebrow>
            <SectionTitle
              title="Prova social com curadoria curta e tom sofisticado."
              body="Em vez de um carrossel genérico, a LP apresenta depoimentos em composicao editorial, mantendo credibilidade e atmosfera."
            />
          </FadeBlock>

          <div className="grid gap-5 lg:grid-cols-3">
            {content.testimonials.map((testimonial, index) => (
              <FadeBlock
                key={testimonial.author}
                delay={index * 0.1}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,155,56,0.16),transparent_24%)]" />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <Quote className="size-6 text-[var(--color-accent)]" />
                    <div className="flex gap-1 text-[var(--color-accent)]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="size-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-base leading-7 text-white/74">{testimonial.text}</p>
                  <div className="border-t border-white/8 pt-5">
                    <p className="font-semibold text-[var(--color-cream)]">{testimonial.author}</p>
                    <p className="mt-1 text-sm text-white/45">{testimonial.context}</p>
                  </div>
                </div>
              </FadeBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-12 pt-18 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur-2xl md:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <FadeBlock className="space-y-6">
              <SectionEyebrow>Reserva e localizacao</SectionEyebrow>
              <SectionTitle
                title="Toda a clareza que um visitante precisa para reservar agora."
                body="O fechamento elimina friccao: WhatsApp direto, endereco, horario e respostas curtas para a decisao acontecer no mobile sem perder o clima premium."
              />
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <a href={content.contact.whatsappHref} {...contactWhatsappProps}>
                    <MessageCircle className="size-4" />
                    {content.contact.whatsappLabel}
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href={content.contact.mapsHref} {...contactMapsProps}>
                    <MapPin className="size-4" />
                    Ver localizacao
                  </a>
                </Button>
              </div>
            </FadeBlock>

            <FadeBlock className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.8rem] border border-white/10 bg-black/22 p-5">
                <div className="flex items-center gap-3 text-[var(--color-accent)]">
                  <PhoneCall className="size-5" />
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                    Contato
                  </p>
                </div>
                <p className="mt-5 text-2xl font-semibold text-[var(--color-cream)]">
                  {content.contact.phone}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/66">{content.contact.address}</p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-black/22 p-5">
                <div className="flex items-center gap-3 text-[var(--color-accent)]">
                  <Clock3 className="size-5" />
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                    Horarios
                  </p>
                </div>
                <div className="mt-5 space-y-3 text-sm leading-7 text-white/66">
                  {content.contact.hours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-black/22 p-5 md:col-span-2">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/42">
                  Perguntas rapidas
                </p>
                <div className="mt-5 grid gap-4">
                  {content.faq.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-4"
                    >
                      <p className="font-semibold text-[var(--color-cream)]">{item.question}</p>
                      <p className="mt-2 text-sm leading-7 text-white/64">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeBlock>
          </div>

          <FadeBlock delay={0.15} className="mt-10 border-t border-white/8 pt-6">
            <div className="flex flex-col gap-4 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
              <p>{content.brand}</p>
              <p>Landing page premium preparada para assets finais de fotos e modelo 3D.</p>
            </div>
          </FadeBlock>
        </div>
      </section> */}
    </main>
  );
}
