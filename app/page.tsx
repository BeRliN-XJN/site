"use client";

import { useEffect, useRef, useState } from "react";

const questions = ["今天", "明天", "下周", "下个月", "明年"];

function Mascot({ kind, label, action }: { kind: string; label: string; action: string }) {
  const sources: Record<string, string> = {
    capy: "/characters/capybara-lulu.png",
    mochi: "/characters/sprout-mochi.png",
    cat: "/characters/cc-cat.png",
  };
  return (
    <div className={`mascot ${kind} ${action}`} aria-label={`${label}正在${action === "kiss" ? "亲吻" : action === "cry" ? "流泪" : "和你打招呼"}`}>
      {/* 三个角色原图位于 public/characters，可直接用同名图片替换 */}
      <img src={sources[kind]} alt={label} draggable="false" />
      {action === "kiss" && <span className="kiss-heart">♥</span>}
      {action === "cry" && <><span className="tear t1" /><span className="tear t2" /></>}
      <span className="mascot-name">{label}</span>
    </div>
  );
}

function BackgroundMascots({ phase }: { phase: number }) {
  return (
    <div className={`mascot-world phase-${phase}`} aria-hidden="true">
      <div className="world-mascot world-capy">
        <img src="/characters/capybara-lulu-transparent.png" alt="" draggable="false" />
        <span className="motion-dust"><i /><i /><i /></span>
      </div>
      <div className="world-mascot world-cat">
        <img src="/characters/cc-cat-transparent.png" alt="" draggable="false" />
        <span className="motion-wave">⌒</span>
      </div>
    </div>
  );
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [question, setQuestion] = useState<number | null>(null);
  const [sad, setSad] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastChoice, setLastChoice] = useState<"love" | null>(null);
  const [mascotPhase, setMascotPhase] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.18 });
    elements.forEach(el => observer.observe(el));
    const onScroll = () => {
      document.documentElement.style.setProperty("--scroll", String(window.scrollY));
      const progress = window.scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      setMascotPhase(Math.min(4, Math.floor(progress * 5)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [entered]);

  const enter = () => {
    setEntered(true);
    audioRef.current?.play().catch(() => setMuted(true));
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    if (muted) audioRef.current.play().catch(() => {});
    setMuted(!muted);
  };

  const chooseLove = () => {
    setLastChoice("love");
    if (question === questions.length - 1) { setFinished(true); return; }
    setQuestion((question ?? 0) + 1);
  };

  const resetChoice = () => { setSad(false); setFinished(false); setLastChoice(null); setQuestion(null); };

  const share = async () => {
    const data = { title: "玲儿专属", text: "把喜欢，写进每一个明天。", url: location.href };
    if (navigator.share) await navigator.share(data).catch(() => {});
    else { await navigator.clipboard?.writeText(location.href); alert("专属链接已复制好啦 ♥"); }
  };

  return (
    <main>
      {/* 背景音乐会在用户点击启动页后自动播放，以兼容 iOS/Android 的播放限制 */}
      <audio ref={audioRef} loop preload="auto" src="/music/familiar-stranger.mp3" />

      <div className={`gate ${entered ? "gate-open" : ""}`} aria-hidden={entered}>
        <div className="gate-stars" />
        <p>FOR MY FAVORITE PERSON</p>
        <h1>玲儿专属</h1>
        <span className="gate-note">有一封藏在晚霞里的信，想请你签收</span>
        <button onClick={enter} className="enter-button"><i>♥</i> 点击进入</button>
        <small>建议开启声音 · 慢慢往下滑</small>
      </div>

      {entered && <button className="sound-button" onClick={toggleMute} aria-label={muted ? "开启背景音乐" : "关闭背景音乐"}>{muted ? "♩" : "♫"}<span>{muted ? "开启" : "音乐"}</span></button>}

      <div className="sky" aria-hidden="true"><div className="sun" /><div className="stars" /><div className="constellation">✦ ·　✦<br />　 ·　✦　 · ✦<br />　　　　✦</div><div className="cloud c1" /><div className="cloud c2" /></div>
      {entered && <BackgroundMascots phase={mascotPhase} />}

      <section className="hero">
        <div className="eyebrow" data-reveal="fade">TO LING · 只给你看</div>
        <h2 data-reveal="words"><span>想把每一次心动</span><span>都好好告诉你</span></h2>
        <p data-reveal="slide">从一场晚霞开始，陪你走到星星都亮起来。</p>
        <div className="scroll-hint"><i />向下滑，故事才刚刚开始</div>
      </section>

      <section className="letter chapter">
        <div className="chapter-no" data-reveal="fade">01 / 初见</div>
        <p className="big-copy" data-reveal="words"><span>人海那么大，</span><span>偏偏是你让我想</span><em>停留久一点。</em></p>
        <div className="photo-placeholder" data-reveal="slide">
          {/* 静音是移动端允许视频自动播放的必要条件；背景音乐仍会正常播放 */}
          <video autoPlay muted loop playsInline preload="metadata" aria-label="我们的爱心手势视频">
            <source src="/memories/heart-hands.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="promise chapter">
        <div className="chapter-no" data-reveal="fade">02 / 喜欢</div>
        <p className="tiny" data-reveal="type">如果喜欢有形状——</p>
        <p className="big-copy" data-reveal="words"><span>大概是分享日落，</span><span>记住你的口味，</span><em>还有每一次想你。</em></p>
        <div className="note-card" data-reveal="slide"><b>给玲儿的小纸条</b><p>这里是你的专属文案占位符。可以写纪念日、第一次见面的故事，或一句只有你们才懂的话。</p><span>—— 永远站在你这边的人</span></div>
      </section>

      <section className="night chapter">
        <div className="chapter-no light" data-reveal="fade">03 / 以后</div>
        <p className="big-copy light" data-reveal="words"><span>晚霞会落下，</span><span>可星星会替我</span><em>继续说喜欢你。</em></p>
        <p className="star-note" data-reveal="slide">北斗七星替我指路，<br />北极星替我守着你。</p>
      </section>

      <section className="ask chapter">
        <p className="eyebrow" data-reveal="fade">最后，认真问你一件事</p>
        <h2 data-reveal="words"><span>关于我们的</span><span>一千个明天</span></h2>
        <button className="ask-button" data-reveal="slide" onClick={() => { setQuestion(0); setLastChoice(null); }}>我准备好回答了 <span>→</span></button>
      </section>

      <section className="share-section">
        <div className="share-card" data-reveal="slide"><small>LING&apos;S LOVE LETTER</small><h3>玲儿专属</h3><p>把喜欢，写进每一个明天。</p><div className="card-moons">☾　✦　♡</div></div>
        <button className="share-button" onClick={share}>分享这份心意 ↗</button>
      </section>

      {/* 五个问题在同一弹层内切换，移动端不会发生页面重载 */}
      {question !== null && <div className="choice-layer" role="dialog" aria-modal="true" aria-label="爱的问答">
        <div className="choice-backdrop" />
        <button className="back-button" onClick={() => question === 0 ? setQuestion(null) : setQuestion(question - 1)}>← 返回</button>
        <div className="choice-content" key={`${question}-${sad}-${finished}`}>
          {finished ? <>
            <p className="step">FOREVER · 永远有效</p><h2>我也爱你！</h2><p className="choice-sub">这次、下次，还有以后的每一次。</p>
            <video className="branch-video" autoPlay muted loop playsInline preload="metadata" aria-label="选择爱之后的视频">
              <source src="/choices/love.mp4" type="video/mp4" />
            </video>
            <div className="number-placeholder">13147773</div>
            <button className="restart" onClick={resetChoice}>再看一遍 ♥</button>
          </> : sad ? <>
            <p className="step">没关系，再想一小会儿</p><h2>呜……真的嘛？</h2><p className="choice-sub">团子已经偷偷掉眼泪了。</p>
            <video className="branch-video" autoPlay muted loop playsInline preload="metadata" aria-label="选择 emm 之后的视频">
              <source src="/choices/emm.mp4" type="video/mp4" />
            </video>
            <Mascot kind="mochi large" label="长草颜团子" action="cry" />
            <button className="love-button" onClick={() => { setSad(false); setLastChoice(null); }}>好啦，选“爱！”</button>
          </> : <>
            <p className="step">{String(question + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</p>
            <h2>你{questions[question]}爱我吗？</h2><p className="choice-sub">要认真选哦，玲儿。</p>
            {lastChoice === "love" && <video className="branch-video compact" autoPlay muted loop playsInline preload="metadata" aria-label="选择爱之后的视频">
              <source src="/choices/love.mp4" type="video/mp4" />
            </video>}
            <div className="choices"><button className="love-button" onClick={chooseLove}>爱！<span>♥</span></button><button className="hmm-button" onClick={() => setSad(true)}>emm...</button></div>
            <div className="progress">{questions.map((_, i) => <i key={i} className={i <= question ? "active" : ""} />)}</div>
          </>}
        </div>
      </div>}
    </main>
  );
}
