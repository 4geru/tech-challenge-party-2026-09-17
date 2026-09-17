import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateSky, describeMoonPhase } from './astronomy/sky';
import { formatObservationDate, localObservationToUtc } from './astronomy/time';
import { ControlPanel } from './components/ControlPanel';
import { SkyCanvas } from './components/SkyCanvas';
import type { DisplayOptions, ObservationLocation } from './types';

const initialLocation: ObservationLocation = {
  name: '東京都、日本',
  latitude: 35.6812,
  longitude: 139.7671,
  elevation: 40,
  timezone: 'Asia/Tokyo',
};

export default function App() {
  const [date, setDate] = useState('2000-01-01');
  const [time, setTime] = useState('21:00');
  const [location, setLocation] = useState(initialLocation);
  const [magnitudeLimit, setMagnitudeLimit] = useState(6.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const skyCardRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<DisplayOptions>({
    constellations: true,
    labels: true,
    planets: true,
  });

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === skyCardRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const calculation = useMemo(() => {
    try {
      const utc = localObservationToUtc(date, time, location.timezone);
      return { sky: calculateSky(utc, location, magnitudeLimit), error: '' };
    } catch (error) {
      return { sky: null, error: error instanceof Error ? error.message : '星空を計算できませんでした。' };
    }
  }, [date, time, location, magnitudeLimit]);

  const visibleStars = calculation.sky?.stars.filter((star) => star.altitude >= 0).length ?? 0;

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await skyCardRef.current?.requestFullscreen();
    } catch {
      // Fullscreen may be blocked by the browser or embedding context.
    }
  };

  return (
    <main className="app-shell" id="top">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="あの日の空 ホーム">
          <span className="brand-orbit" aria-hidden="true"><span>✦</span></span>
          <span>あの日の空</span>
        </a>
        <p>Birthday Sky Archive</p>
        <span className="header-note">ASTRONOMY × MEMORY</span>
      </header>

      <section className="workspace">
        <aside className="control-panel">
          <div className="hero-copy">
            <p className="eyebrow">YOUR SKY, THAT NIGHT</p>
            <h1>あの日、空には<br />何が見えていた？</h1>
            <p className="intro">生まれた日、生まれた場所。<br />あなたの物語が始まった夜空をひらきます。</p>
          </div>
          <ControlPanel
            date={date}
            time={time}
            location={location}
            magnitudeLimit={magnitudeLimit}
            options={options}
            error={calculation.error}
            onDateChange={setDate}
            onTimeChange={setTime}
            onLocationChange={setLocation}
            onMagnitudeLimitChange={setMagnitudeLimit}
            onOptionsChange={setOptions}
          />
          <p className="data-credit">恒星データ NASA/HEASARC BSC5P · 天体計算 Astronomy Engine · 地名検索 © OpenStreetMap contributors</p>
        </aside>

        <section className="sky-stage" aria-label="星空表示領域">
          <div className="stage-heading">
            <div>
              <p className="stage-kicker">THE SKY ABOVE</p>
              <h2>{formatObservationDate(date)}</h2>
              <p>{time} · {location.name}</p>
            </div>
            <span className="mode-badge"><span>◐</span>観測表示</span>
          </div>

          <div className="sky-card" ref={skyCardRef}>
            <button
              className="fullscreen-button"
              type="button"
              onClick={() => void toggleFullscreen()}
              disabled={!document.fullscreenEnabled}
              aria-label={isFullscreen ? 'フルスクリーンを終了' : '星空をフルスクリーン表示'}
            >
              <span aria-hidden="true">{isFullscreen ? '↙' : '↗'}</span>
              <strong>{isFullscreen ? '終了' : '全画面'}</strong>
            </button>
            {calculation.sky ? (
              <SkyCanvas sky={calculation.sky} options={options} />
            ) : (
              <div className="sky-error"><span>!</span><p>{calculation.error}</p></div>
            )}
            {calculation.sky && (
              <div className="sky-stats">
                <div><span>VISIBLE STARS</span><strong>{visibleStars.toLocaleString()}<small> stars</small></strong></div>
                <div><span>MOON</span><strong>{describeMoonPhase(calculation.sky.moonPhase)}</strong></div>
                <div><span>LIMIT</span><strong>{calculation.sky.limitingMagnitude.toFixed(1)}<small> mag</small></strong></div>
              </div>
            )}
          </div>

          <div className="stage-footnote">
            <span className="line" />
            <p>恒星位置と等級はNASA/HEASARC Bright Star Catalogを使用。空の明るさと月明かりも表示限界に反映します。</p>
          </div>
        </section>
      </section>
    </main>
  );
}
