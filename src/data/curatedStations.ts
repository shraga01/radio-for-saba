import type { Station } from '../types/radio';

export const CURATED_ISRAEL_STATIONS: Station[] = [
  {
    id: 'il-kan-bet',
    name: "כאן ב' (רשת ב')",
    originalName: 'Kan Bet',
    subtitle: 'חדשות, אקטואליה ויומני חדשות',
    streamUrl: 'https://28563.live.streamtheworld.com/KAN_BET.mp3',
    backupStreamUrl: 'https://r.il.cdn-redge.media/livehls/oil/kancdn-live/live/radio/kan_reshet_bet/live.livx/playlist.m3u8?renditions',
    country: 'IL',
    category: 'news',
    isCurated: true,
    clickcount: 99999
  },
  {
    id: 'il-galgalatz',
    name: 'גלגלצ',
    originalName: 'Galgalatz',
    subtitle: 'מוזיקה מעולה ודיווחי תנועה',
    streamUrl: 'https://glzwizzlv.bynetcdn.com/glglz_mp3',
    country: 'IL',
    category: 'israeli_music',
    isCurated: true,
    clickcount: 99998
  },
  {
    id: 'il-glz',
    name: 'גלי צה"ל',
    originalName: 'Galei Zahal',
    subtitle: 'שידורי אקטואליה, תרבות וחדשות',
    streamUrl: 'https://glzwizzlv.bynetcdn.com/glz_mp3',
    country: 'IL',
    category: 'news',
    isCurated: true,
    clickcount: 99997
  },
  {
    id: 'il-lev-hamedina',
    name: 'רדיו לב המדינה 91FM',
    originalName: 'Radio Lev Hamedina',
    subtitle: 'מוזיקה ים תיכונית וישראלית שמחה',
    streamUrl: 'https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio',
    country: 'IL',
    category: 'mediterranean',
    isCurated: true,
    clickcount: 99996
  },
  {
    id: 'il-kan-gimel',
    name: 'כאן גימל',
    originalName: 'Kan Gimel',
    subtitle: 'הבית של המוזיקה הישראלית',
    streamUrl: 'https://27873.live.streamtheworld.com/KAN_GIMMEL.mp3',
    backupStreamUrl: 'https://r.il.cdn-redge.media/livehls/oil/kancdn-live/live/radio/kan_gimel/live.livx/playlist.m3u8?renditions',
    country: 'IL',
    category: 'israeli_music',
    isCurated: true,
    clickcount: 99995
  },
  {
    id: 'il-103fm',
    name: '103FM',
    originalName: 'Radio 103FM',
    subtitle: 'רדיו ללא הפסקה, שיחות ואקטואליה',
    streamUrl: 'https://cdn.cybercdn.live/103FM/Live/icecast.audio',
    country: 'IL',
    category: 'news',
    isCurated: true,
    clickcount: 99994
  },
  {
    id: 'il-eco99fm',
    name: 'אקו 99FM',
    originalName: 'Eco 99FM',
    subtitle: 'מוזיקה מעולה לכל מצב רוח',
    streamUrl: 'https://eco-live.mediacast.co.il/99fm_aac',
    country: 'IL',
    category: 'israeli_music',
    isCurated: true,
    clickcount: 99993
  },
  {
    id: 'il-jerusalem',
    name: 'רדיו ירושלים 101FM',
    originalName: 'Radio Jerusalem',
    subtitle: 'התחנה המובילה של ירושלים והסביבה',
    streamUrl: 'https://radio.streamgates.net/stream/101fm',
    country: 'IL',
    category: 'israeli_music',
    isCurated: true,
    clickcount: 99992
  },
  {
    id: 'il-haifa',
    name: 'רדיו חיפה 107.5FM',
    originalName: 'Radio Haifa',
    subtitle: 'מוזיקה וחדשות הצפון והקריות',
    streamUrl: 'https://1075.livecdn.biz/radiohaifa',
    country: 'IL',
    category: 'israeli_music',
    isCurated: true,
    clickcount: 99991
  },
  {
    id: 'il-darom',
    name: 'רדיו דרום 97FM',
    originalName: 'Radio Darom',
    subtitle: 'מוזיקה ישראלית, ים-תיכונית וחדשות הדרום',
    streamUrl: 'https://cdn.cybercdn.live/Darom_1015FM/Live/icecast.audio',
    country: 'IL',
    category: 'mediterranean',
    isCurated: true,
    clickcount: 99990
  },
  {
    id: 'il-radio-yasoo',
    name: 'רדיו יאסו',
    originalName: 'Radio Yasoo',
    subtitle: 'רדיו יווני מקצועי מישראל – 24 שעות ביממה',
    streamUrl: 'https://liveradio.co.il/radioyasoo',
    country: 'IL',
    category: 'mediterranean',
    isCurated: true,
    clickcount: 99989
  }
];

export const CURATED_GREECE_STATIONS: Station[] = [
  {
    id: 'gr-sfera',
    name: 'ספירה (Sfera 102.2)',
    originalName: 'Sfera 102.2 Athens',
    subtitle: 'להיטים יווניים פופולריים ועכשוויים',
    streamUrl: 'https://sfera.live24.gr/sfera4132',
    country: 'GR',
    category: 'hits',
    isCurated: true,
    clickcount: 89999
  },
  {
    id: 'gr-rythmos',
    name: 'ריתמוס (Rythmos 94.9)',
    originalName: 'Rythmos 94.9 Athens',
    subtitle: 'מצעד הלהיטים והפופ מיוון',
    streamUrl: 'http://stream.radiojar.com/aw1w2xfx1vduv',
    country: 'GR',
    category: 'hits',
    isCurated: true,
    clickcount: 89998
  },
  {
    id: 'gr-dromos',
    name: 'דרומוס (Dromos 89.8)',
    originalName: 'Dromos 89.8 FM',
    subtitle: 'מוזיקה יוונית עכשווית ואנרגטית',
    streamUrl: 'https://n07-eu1.rcs.revma.com/10q3enqxbfhvv',
    country: 'GR',
    category: 'hits',
    isCurated: true,
    clickcount: 89997
  },
  {
    id: 'gr-laikos',
    name: 'לאיקוס (Laikos 87.6)',
    originalName: 'Laikos 87.6 Thessaloniki',
    subtitle: 'מוזיקה עממית (לאיקה) מקורית מסלוניקי',
    streamUrl: 'http://netradio.live24.gr/laikos876',
    country: 'GR',
    category: 'laika',
    isCurated: true,
    clickcount: 89996
  },
  {
    id: 'gr-derti',
    name: 'דרטי (Derti 98.6)',
    originalName: 'Derti Athens',
    subtitle: 'לאיקה כבדה וקלאסית, זמר עממי יווני',
    streamUrl: 'https://derti.live24.gr/derty1000',
    country: 'GR',
    category: 'laika',
    isCurated: true,
    clickcount: 89995
  },
  {
    id: 'gr-melodia',
    name: 'מלודיה (Melodia 99.2)',
    originalName: 'Melodia 99.2 Athens',
    subtitle: 'קלאסיקות ואמנותית יוונית (Entechno)',
    streamUrl: 'https://stream.rcs.revma.com/8tdwa6ez1duvv',
    country: 'GR',
    category: 'classics',
    isCurated: true,
    clickcount: 89994
  },
  {
    id: 'gr-menta',
    name: 'מנטה (Menta 88)',
    originalName: 'Menta 88 Athens',
    subtitle: 'שירים יווניים אהובים, רוגע ונוסטלגיה',
    streamUrl: 'https://netradio.live24.gr/menta88ath',
    country: 'GR',
    category: 'classics',
    isCurated: true,
    clickcount: 89993
  },
  {
    id: 'gr-diesi',
    name: 'דיאסי (Diesi 101.3)',
    originalName: 'Diesi 101.3 Athens',
    subtitle: 'מוזיקה יוונית שקטה, מובחרת ואיכותית',
    streamUrl: 'https://n05a-eu.rcs.revma.com/gkfwrhqxbfhvv',
    country: 'GR',
    category: 'classics',
    isCurated: true,
    clickcount: 89992
  },
  {
    id: 'gr-lampsi',
    name: 'למפסי (Lampsi 92.3)',
    originalName: 'Lampsi 92.3 Athens',
    subtitle: 'להיטי זהב ומוזיקה שמחה מאתונה',
    streamUrl: 'https://az11.yesstreaming.net:8140/radio.mp3',
    country: 'GR',
    category: 'hits',
    isCurated: true,
    clickcount: 89991
  },
  {
    id: 'gr-ellinikos',
    name: 'אליניקוס (Ellinikos 93.2)',
    originalName: 'Ellinikos 93.2',
    subtitle: 'שירים יווניים מכל הזמנים, בלדות ונוסטלגיה',
    streamUrl: 'http://netradio.live24.gr/orange9320',
    country: 'GR',
    category: 'classics',
    isCurated: true,
    clickcount: 89990
  },
  {
    id: 'gr-ert-deftero',
    name: 'ERT דפטרו (Deftero 103.7)',
    originalName: 'ERT Deftero Programma 103.7',
    subtitle: 'הרדיו הממלכתי של יוון – מיטב המוזיקה היוונית',
    streamUrl: 'https://radiostreaming.ert.gr/ert-deftero',
    country: 'GR',
    category: 'classics',
    isCurated: true,
    clickcount: 89989
  },
  {
    id: 'gr-ert-laika',
    name: 'ERT דפטרו לאיקה (Deftero Laika)',
    originalName: 'ERT Deftero Laika',
    subtitle: 'ערוץ הלאיקה והרבטיקו הרשמי של יוון',
    streamUrl: 'http://radiostreaming.ert.gr/ert-talaika',
    country: 'GR',
    category: 'laika',
    isCurated: true,
    clickcount: 89988
  },
  {
    id: 'gr-skai',
    name: 'סקאי (Skai 100.3)',
    originalName: 'SKAI 100.3 Athens',
    subtitle: 'רדיו אתונה – חדשות, שיחות ומוזיקה',
    streamUrl: 'https://skai.live24.gr/skai1003',
    country: 'GR',
    category: 'hits',
    isCurated: true,
    clickcount: 89987
  }
];

// Preloaded default favorites: top 6 Israeli stations and top 8 Greek stations
export const DEFAULT_FAVORITE_IDS: string[] = [
  // Top 6 Israeli
  'il-kan-bet',
  'il-galgalatz',
  'il-glz',
  'il-lev-hamedina',
  'il-kan-gimel',
  'il-103fm',
  // Top 8 Greek
  'gr-sfera',
  'gr-rythmos',
  'gr-dromos',
  'gr-laikos',
  'gr-derti',
  'gr-melodia',
  'gr-menta',
  'gr-skai'
];
