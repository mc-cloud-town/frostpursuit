import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Language = 'en' | 'zh';

interface ImageFigureProps {
    src: string;
    caption: string;
    figNum: string;
}

function ImageFigure({ src, caption, figNum }: ImageFigureProps) {
    return (
        <figure className="blog-figure">
            <img
                src={`${import.meta.env.BASE_URL}images/frost pursuit redstone/${src}`}
                alt={caption}
                loading="lazy"
            />
            <figcaption>
                <span className="fig-num">{figNum}</span> {caption}
            </figcaption>
        </figure>
    );
}

// Content in both languages
const content = {
    en: {
        backBtn: 'Back to Home',
        category: 'Technical Documentation',
        title: 'Universal Race Track System',
        subtitle: 'A detailed explanation of the redstone-powered race timing, leaderboard, and display system used in Frost Pursuit.',
        author: 'Yi_Breeze',
        date: 'September 26, 2024',
        toc: 'Table of Contents',
        tocItems: [
            'Race Registration UI',
            'Whitelist System',
            'Timer System',
            'Insertion Sort Algorithm',
            'Control Panel',
            'Display System',
            'Credits'
        ],
        overview: {
            caption: 'System overview showing the complete redstone infrastructure',
            lead: 'This document details the design philosophy, components, and usage of the universal race track system. The entire system is powered by vanilla redstone—no mods, no command blocks.'
        },
        sections: {
            registration: {
                title: 'Initial Race Registration UI',
                caption: 'Initial Race Registration UI where players input their ID items',
                p1: 'When a player first participates, they name a stack of 64 items. One item is kept as an ID card for triggering the finish line. The remaining 63 items are placed into this UI.',
                note: 'Note: Items must be placed in strict batches of 63. After all players have submitted, press the note block to begin processing.',
                p2: 'The system then splits each batch: 15 items go to the Whitelist UI for future races, and 48 items go to the Insertion Sort Algorithm for leaderboard processing.'
            },
            whitelist: {
                title: 'Whitelist System (Returning Players)',
                caption: 'Whitelist UI for returning players to retrieve their ID cards',
                p1: 'After first registration, 15 ID items are stored here. Returning players simply retrieve one ID card from the chest to participate.',
                p2: 'This UI also acts as a whitelist validator. When a player crosses the finish line and submits their ID:',
                invalid: 'If invalid: The ID is rejected and sent to a discard barrel. The timer does not record.',
                valid: 'If valid: Two ID cards are processed—one for the current race UI, one for timing and leaderboard entry.'
            },
            timer: {
                title: 'Timer System',
                caption1: '3-layer timer with 10 shift registers for storing race times',
                h31: 'Timer Overview',
                p1: 'The timer consists of three layers: minutes, seconds (tens), and seconds (units). It uses shift registers to store up to 10 player times for later leaderboard processing.',
                h32: 'Carry Rules',
                p2: 'To ensure all three digits update synchronously (critical for accurate display), a custom carry rule is used:',
                p3: 'This delayed carry logic prevents "ghosting" or visual glitches during time transitions. The intermediate 0:60 state is internal only and not displayed.',
                caption2: '3-bit adder used in timer calculations'
            },
            sorting: {
                title: 'Insertion Sort Algorithm',
                caption1: 'The insertion sort module - the heart of the leaderboard system',
                lead: 'The core of the system. It automatically sorts incoming race times to maintain a top 10 leaderboard.',
                h3: 'Comparison Logic',
                p1: 'Since Minecraft comparators compare which signal is greater, not smaller, we invert the input signals before comparison. This transforms "find smallest" into "find largest."',
                steps: [
                    'Minutes Comparison: If new > stored, overwrite immediately. If equal, proceed to seconds.',
                    'Seconds (Tens) Comparison: Same logic—overwrite if greater, continue if equal.',
                    'Seconds (Units) Comparison: Final tiebreaker. Overwrite if greater, otherwise pass to next slot.',
                    'Cascade: Displaced data re-enters the system and compares with subsequent slots until all 10 are processed.'
                ],
                caption2: 'A single insertion sort unit - compact design storing one player\'s data',
                warning: 'Design Trade-off: Re-inputting displaced data increases algorithm complexity and processing time, but significantly reduces the physical footprint of the system.'
            },
            control: {
                title: 'Control Panel',
                caption1: 'Priority queue-based process manager preventing operation conflicts',
                p1: 'The control panel uses indicator lights and a selector system. Players must confirm each action by clicking the note block to prevent accidental triggers.',
                h3: 'Available Operations',
                cards: [
                    { title: 'Query', desc: 'Look up specific rankings from the algorithm. Cross-dimension signal transmission using shulker box encoding.' },
                    { title: 'Input Algorithm', desc: 'Transfer shift register data into the insertion sort algorithm for processing.' },
                    { title: 'Sync Display', desc: 'Update the leaderboard display and chest UI with current algorithm data.' },
                    { title: 'Clear Registers', desc: 'Wipe shift register data. Automatically triggered at race start.' }
                ],
                caption2: 'Nether portal chunk loader ensuring continuous system operation'
            },
            display: {
                title: 'Display System',
                captions: [
                    'Modular 7-segment display unit',
                    'Analog to 7-segment binary converter',
                    '26-bit serial binary box transcoder for encoding',
                    '26-bit 4gt decoder for signal reconstruction',
                    'Low-latency comparator chain for instant vertical signal transmission',
                    'BED-encoded latency-free analog downlink for instant vertical transmission'
                ],
                h3: 'Cross-Dimension Transmission',
                p1: 'Since the overworld display location has limited space, signals are transmitted between dimensions using:'
            },
            credits: {
                title: 'Credits',
                building: 'Building',
                redstone: 'Redstone',
                thanks: 'Special Thanks',
                original: 'Original article:'
            }
        },
        learnMore: 'Learn More'
    },
    zh: {
        backBtn: '返回首頁',
        category: '技術文檔',
        title: '通用賽道系統詳解',
        subtitle: '詳細解釋此系統的設計思路、用途和用法（冰船）',
        author: '晚的Breeze',
        date: '2024年9月26日',
        toc: '目錄',
        tocItems: [
            '初次比賽UI',
            '白名單系統',
            '計時器',
            '插入排序算法',
            '控制面板',
            '顯示器',
            '致謝'
        ],
        overview: {
            caption: '系統各個部件耦合後的俯視圖',
            lead: '本文將詳細解釋此系統的設計思路、用途和用法。整個系統由純原版紅石驅動——無模組、無命令方塊。'
        },
        sections: {
            registration: {
                title: '初次比賽UI',
                caption: '初次比賽UI：玩家在此輸入命名物',
                p1: '參賽玩家在初次比賽時都會命名一組物品。每個玩家將命名的一組物品留一個在身上用於比賽結束後的觸發終點計入成績的操作（ID卡），將剩餘的63個物品放入此UI。',
                note: '注意：需要嚴格按照每批命名物63個的要求放入。等待所有玩家都放入後，按下音符盒開始處理。',
                p2: '這個部件會將每一堆63個的命名物分成15+48個。15個物品會被分到非初次比賽UI處，用於這些玩家下一次比賽時的ID卡。48個物品被分到插入排序算法處。'
            },
            whitelist: {
                title: '白名單系統（非初次比賽）',
                caption: '非初次比賽UI（白名單）',
                p1: '當玩家有過一次比賽記錄後，會有15個命名物從初次比賽UI中被分入此處。此後玩家只需要到此UI右側的箱子內找到自己的命名物（ID卡）並取出一個進行比賽即可。',
                p2: '此UI還有著白名單的作用。玩家在終點放/丟入的ID卡會先到此處進行比對：',
                invalid: '若不符合（即箱子內無此命名物）：則會輸出到左側木桶中，賽道的計時器不會觸發取數，玩家成績作廢。',
                valid: '若符合（箱子內有同樣的命名物）：則會將箱子內的ID卡再取一個並輸出。一個用於生成本次比賽的盒子UI，一個用於計時取數。'
            },
            timer: {
                title: '計時器',
                caption1: '三層計時器+三層移位寄存器×10',
                h31: '計時器概覽',
                p1: '計時器分為三層，從上至下依次為分、秒十位、秒個位，即三位模電信號。使用移位寄存器可儲存10個信息，用於後續玩家判斷是否輸入插入排序算法。',
                h32: '進位規則',
                p2: '為保證計時器的每一秒都能夠被取到，要做到三位模電信號的進位過程同步：',
                p3: '本質上是通過改變進位規則在進位時給足了遊戲內延時的判斷時間，在不需要更改原本計時器的同時完成精確到每一秒的讀取操作。',
                caption2: '三位加法器用於計時計算'
            },
            sorting: {
                title: '插入排序算法',
                caption1: '插入排序算法——整個系統的核心部分',
                lead: '這是整個系統的核心部分。它的功能是將輸入的數據自動排序後儲存。',
                h3: '比對邏輯',
                p1: '由於遊戲中比較器是比較哪個信號更大，而不是更小，所以我們在輸入前將數據取反。這樣每個單元都變成比大，而不是原來的比小。',
                steps: [
                    '分位比對：若新數據大於儲存數據，則直接覆蓋。若等於，則比對秒十位。',
                    '秒十位比對：同理——若大於則覆蓋，若等於則繼續比對秒個位。',
                    '秒個位比對：最後決勝。若大於則覆蓋，否則順延到下一單元。',
                    '級聯：被覆蓋的數據重新輸入並與下一個單元比對，直到10個單元遍歷完成後捨棄一個最小的數據。'
                ],
                caption2: '插入排序單元——緊湊設計儲存一個玩家的數據',
                warning: '設計權衡：將被覆蓋的數據重新輸入，實現的效果是一樣的。這樣做算法複雜度會更高，計算所需時間會更長，但體積會小得多。'
            },
            control: {
                title: '控制面板',
                caption1: '進程管理（優先級隊列）',
                p1: '面板使用運行指示燈+單選器+確認輸入操作。玩家選中某個操作時，需要再點一下左側的音符盒確認輸入，此操作是為了防止誤觸。',
                h3: '可用操作',
                cards: [
                    { title: '查詢', desc: '主世界查詢插入排序中的三位模電信號。使用潛影盒跨維度傳輸信號。' },
                    { title: '輸入算法', desc: '將移位寄存器中的數據（三位模電信號與ID卡）輸入到插入排序算法中。' },
                    { title: '同步顯示', desc: '將插入排序的數據同步到對應的顯示器與盒子UI中。' },
                    { title: '清空寄存器', desc: '清空移位寄存器內的數據。每次比賽開始都會自動觸發。' }
                ],
                caption2: '地獄門加載器確保系統持續運行'
            },
            display: {
                title: '顯示器',
                captions: [
                    '模塊化七段數碼管顯示單元',
                    '模轉七段數碼管轉二進制',
                    '26位串行二進制盒子編碼器',
                    '26位4gt串行二進制盒子解碼器',
                    '低延遲比較器鏈單元',
                    '無延遲模電下傳（BED編碼）'
                ],
                h3: '跨維度傳輸',
                p1: '由於主世界顯示位置空間有限，信號通過以下方式在維度間傳輸：'
            },
            credits: {
                title: '致謝',
                building: '建築',
                redstone: '紅石',
                thanks: '特別感謝',
                original: '原文：'
            }
        },
        learnMore: '了解更多'
    }
};

export function RedstoneBlog() {
    const [lang, setLang] = useState<Language>('en');
    const t = content[lang];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <main className={`blog-main ${lang === 'zh' ? 'lang-zh' : 'lang-en'}`}>
                <article className="blog-article">
                    {/* Language Toggle */}
                    <div className="blog-lang-toggle">
                        <button
                            className={lang === 'en' ? 'active' : ''}
                            onClick={() => setLang('en')}
                        >
                            EN
                        </button>
                        <span className="lang-divider">/</span>
                        <button
                            className={lang === 'zh' ? 'active' : ''}
                            onClick={() => setLang('zh')}
                        >
                            繁中
                        </button>
                    </div>

                    {/* Back Button */}
                    <Link to="/" className="blog-back-btn">
                        <span className="back-arrow">←</span> {t.backBtn}
                    </Link>

                    {/* Hero Section */}
                    <header className="blog-hero">
                        <div className="blog-hero-content">
                            <span className="blog-category">{t.category}</span>
                            <h1>{t.title}</h1>
                            <p className="blog-subtitle">{t.subtitle}</p>
                            <div className="blog-meta">
                                <span>By <strong>{t.author}</strong></span>
                                <span className="meta-divider">•</span>
                                <span>{t.date}</span>
                            </div>
                        </div>
                    </header>

                    {/* Table of Contents */}
                    <nav className="blog-toc">
                        <h2>{t.toc}</h2>
                        <ol>
                            {t.tocItems.map((item, i) => (
                                <li key={i}><a href={`#section-${i + 1}`}>{item}</a></li>
                            ))}
                        </ol>
                    </nav>

                    {/* Overview */}
                    <section className="blog-section">
                        <ImageFigure
                            src="Overview-min.webp"
                            caption={t.overview.caption}
                            figNum="Fig 0.1"
                        />
                        <p className="blog-lead">{t.overview.lead}</p>
                    </section>

                    {/* Section 1: Registration */}
                    <section className="blog-section" id="section-1">
                        <h2><span className="section-num">1</span>{t.sections.registration.title}</h2>
                        <ImageFigure
                            src="Initial Race Registration UI-min.webp"
                            caption={t.sections.registration.caption}
                            figNum="Fig 1.1"
                        />
                        <p>{t.sections.registration.p1}</p>
                        <div className="blog-callout blog-callout-info">
                            <strong>{lang === 'en' ? 'Note:' : '注意：'}</strong> {t.sections.registration.note.replace('Note: ', '').replace('注意：', '')}
                        </div>
                        <p>{t.sections.registration.p2}</p>
                    </section>

                    {/* Section 2: Whitelist */}
                    <section className="blog-section" id="section-2">
                        <h2><span className="section-num">2</span>{t.sections.whitelist.title}</h2>
                        <ImageFigure
                            src="Race Whitelist Login UI-min.webp"
                            caption={t.sections.whitelist.caption}
                            figNum="Fig 2.1"
                        />
                        <p>{t.sections.whitelist.p1}</p>
                        <p>{t.sections.whitelist.p2}</p>
                        <ul className="blog-list">
                            <li><strong>{lang === 'en' ? 'If invalid:' : '若不符合：'}</strong> {t.sections.whitelist.invalid.replace('If invalid: ', '').replace('若不符合（即箱子內無此命名物）：', '')}</li>
                            <li><strong>{lang === 'en' ? 'If valid:' : '若符合：'}</strong> {t.sections.whitelist.valid.replace('If valid: ', '').replace('若符合（箱子內有同樣的命名物）：', '')}</li>
                        </ul>
                    </section>

                    {/* Section 3: Timer */}
                    <section className="blog-section" id="section-3">
                        <h2><span className="section-num">3</span>{t.sections.timer.title}</h2>
                        <ImageFigure
                            src="3-Layer Timer with Shift Registers-min.webp"
                            caption={t.sections.timer.caption1}
                            figNum="Fig 3.1"
                        />

                        <h3>{t.sections.timer.h31}</h3>
                        <p>{t.sections.timer.p1}</p>

                        <h3>{t.sections.timer.h32}</h3>
                        <p>{t.sections.timer.p2}</p>
                        <pre className="blog-code">
                            {`0:59 → 0:60 (internal) → 1:01 (display)
     ↑ 20gt delay        ↑ simultaneous update`}
                        </pre>
                        <p>{t.sections.timer.p3}</p>

                        <ImageFigure
                            src="3-bit Adder-min.webp"
                            caption={t.sections.timer.caption2}
                            figNum="Fig 3.2"
                        />
                    </section>

                    {/* Section 4: Sorting */}
                    <section className="blog-section" id="section-4">
                        <h2><span className="section-num">4</span>{t.sections.sorting.title}</h2>
                        <ImageFigure
                            src="Insertion Sort Module-min.webp"
                            caption={t.sections.sorting.caption1}
                            figNum="Fig 4.1"
                        />
                        <p className="blog-lead">{t.sections.sorting.lead}</p>

                        <h3>{t.sections.sorting.h3}</h3>
                        <p>{t.sections.sorting.p1}</p>

                        <div className="blog-steps">
                            {t.sections.sorting.steps.map((step, i) => (
                                <div className="blog-step" key={i}>
                                    <span className="step-num">{i + 1}</span>
                                    <div><strong>{step.split(':')[0]}:</strong>{step.split(':').slice(1).join(':')}</div>
                                </div>
                            ))}
                        </div>

                        <ImageFigure
                            src="Insertion Sort Unit-min.webp"
                            caption={t.sections.sorting.caption2}
                            figNum="Fig 4.2"
                        />

                        <div className="blog-callout blog-callout-warning">
                            <strong>{lang === 'en' ? 'Design Trade-off:' : '設計權衡：'}</strong> {t.sections.sorting.warning.replace('Design Trade-off: ', '').replace('設計權衡：', '')}
                        </div>
                    </section>

                    {/* Section 5: Control */}
                    <section className="blog-section" id="section-5">
                        <h2><span className="section-num">5</span>{t.sections.control.title}</h2>
                        <ImageFigure
                            src="Process Manager (Priority Queue Based)-min.webp"
                            caption={t.sections.control.caption1}
                            figNum="Fig 5.1"
                        />

                        <p>{t.sections.control.p1}</p>

                        <h3>{t.sections.control.h3}</h3>
                        <div className="blog-grid">
                            {t.sections.control.cards.map((card, i) => (
                                <div className="blog-card" key={i}>
                                    <h4>{card.title}</h4>
                                    <p>{card.desc}</p>
                                </div>
                            ))}
                        </div>

                        <ImageFigure
                            src="Nether Portal Chunk Loader-min.webp"
                            caption={t.sections.control.caption2}
                            figNum="Fig 5.2"
                        />
                    </section>

                    {/* Section 6: Display */}
                    <section className="blog-section" id="section-6">
                        <h2><span className="section-num">6</span>{t.sections.display.title}</h2>

                        <div className="blog-image-grid">
                            <ImageFigure
                                src="Modular Display Unit-min.webp"
                                caption={t.sections.display.captions[0]}
                                figNum="Fig 6.1"
                            />
                            <ImageFigure
                                src="Analog-7 Segment Display-Binary Converter-min.webp"
                                caption={t.sections.display.captions[1]}
                                figNum="Fig 6.2"
                            />
                        </div>

                        <h3>{t.sections.display.h3}</h3>
                        <p>{t.sections.display.p1}</p>

                        <div className="blog-image-grid">
                            <ImageFigure
                                src="26-Bit Serial Binary Box Transcoder-min.webp"
                                caption={t.sections.display.captions[2]}
                                figNum="Fig 6.3"
                            />
                            <ImageFigure
                                src="26-Bit 4gt Serial Binary Box Decoder-min.webp"
                                caption={t.sections.display.captions[3]}
                                figNum="Fig 6.4"
                            />
                        </div>

                        <ImageFigure
                            src="Low-Latency Comparator Chain Unit-min.webp"
                            caption={t.sections.display.captions[4]}
                            figNum="Fig 6.5"
                        />

                        <ImageFigure
                            src="Latency-Free Analog Downlink (BED Encoded)-min.webp"
                            caption={t.sections.display.captions[5]}
                            figNum="Fig 6.6"
                        />
                    </section>

                    {/* Credits */}
                    <section className="blog-section blog-credits" id="section-7">
                        <h2><span className="section-num">7</span>{t.sections.credits.title}</h2>
                        <div className="credits-grid">
                            <div>
                                <h4>{t.sections.credits.building}</h4>
                                <p>XiaoYu2021, JeadTW</p>
                            </div>
                            <div>
                                <h4>{t.sections.credits.redstone}</h4>
                                <p>Yi_Breeze, Nechnaw, ScLim</p>
                            </div>
                            <div>
                                <h4>{t.sections.credits.thanks}</h4>
                                <p>FlandreLed, redberd, TNT Archive Discord, camphorwood</p>
                            </div>
                        </div>
                        <p className="blog-footer-note">
                            {t.sections.credits.original} <a href="https://www.bilibili.com/opus/979335200181846024" target="_blank" rel="noopener noreferrer">Bilibili</a>
                        </p>
                        <a
                            href="https://www.bilibili.com/opus/979335200181846024"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blog-learn-more"
                        >
                            {t.learnMore} <span className="cta-arrow">▷</span>
                        </a>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
