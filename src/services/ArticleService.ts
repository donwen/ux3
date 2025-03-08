import { supabase } from '../lib/supabaseClient';

// 定義文章鏈接接口
interface ArticleLinks {
  // 視頻ID映射到文章URL
  [videoId: string]: string;
}

// 定義類別映射接口
interface CategoryMapping {
  // 視頻ID映射到類別
  [videoId: string]: string;
}

// 從 title and url.csv 提取的視頻URL到文章鏈接的映射
const videoUrlToArticleMap: { [videoUrl: string]: string } = {
  "https://youtu.be/vphVLcRRSfc": "https://medium.com/design-bootcamp/uxr-user-research-plan-on-netflix-by-melinna-sastra",
  "https://youtu.be/SDIt6qDDOpM": "https://medium.com/@luciaparedes/hooked-app-de-armario-virtual-caso-de-estudio-ux-4dc55581e50a",
  "https://youtu.be/rouzWGWUc14": "https://medium.com/design-bootcamp/reimagining-chatgpt-ui-ux-redesign-case-study-a9927c171a1b",
  "https://youtu.be/6d__e0KtZ8w": "https://medium.com/@beckhamza/the-secret-behind-apple-devices-rounded-corners-the-hidden-genius-of-ux-design-case-study-da609774e606",
  "https://youtu.be/QAv8LDyRaJQ": "https://medium.com/@atul1997.v/co-learn-matchmaking-app-for-study-buddies-a-ux-casestudy-f283292ae363",
  "https://www.youtube.com/watch?v=CRnOPSLuFOU": "https://medium.com/@yapmanying36/ui-ux-case-study-youtube-music-be0fe66eafb3",
  "https://youtu.be/MdW2U8364fY": "https://medium.com/@miqbalmahulana/ui-ux-study-case-redesign-ikea-co-id-a48a1d0c67e4",
  "https://youtu.be/vWOURJSwxrk?si=uYonhwEOpL4u6HWL": "https://akintadetemitope.medium.com/increasing-user-engagement-on-the-spotify-by-creating-a-commenting-and-recommendation-feature-afad9ad59e9e",
  "https://www.youtube.com/watch?v=2FqJzk0Wyzo": "https://medium.com/ux-planet/improving-valorant-e-sports-experience-ui-ux-case-study-37e36415a864",
  "https://youtu.be/EmhO392ervk": "https://medium.com/@lusyaanggrn/burger-king-mobile-app-redesign-ui-ux-case-study-1f8a0d5464d3",
  "https://youtu.be/srHii6GR0iA": "https://medium.com/a11yvillage/case-study-slack-%E7%9A%84%E8%9E%A2%E5%B9%95%E9%96%B1%E8%AE%80%E5%99%A8%E6%93%8D%E4%BD%9C%E9%AB%94%E9%A9%97-f5777a97870d",
  "https://youtu.be/KSR5-4U0zxc?si=b-_ZwYd5FHbMEuq0": "https://medium.com/design-bootcamp/access-for-all-the-impact-of-a-wheelchair-friendly-travel-app-a91d3513f391",
  "https://youtu.be/R5fpkywXcm8?feature=shared": "https://medium.com/design-bootcamp/enhancing-the-netflix-search-experience-a-ux-design-case-study-9c014302d98f",
  "https://youtu.be/qfkjSTEfvng": "https://medium.com/@jackalberttrew/generation-change-a-responsive-redesign-ux-ui-605b811c84f8",
  "https://youtu.be/LYeb1UYIIIs": "https://medium.com/ux-planet/dominos-pizza-mobile-app-redesign-ui-ux-case-study-2174ada48876",
  "https://youtu.be/gzswvKgJJ4k": "https://medium.com/@ninadsonidesigns/bookbuddy-ui-ux-case-study-444e3cd85ab6",
  "https://youtu.be/BBiIV2JojRo?feature=shared": "https://medium.com/@putrinatalisitumorang/ux-case-study-recipe-app-resepmu-29b9d3771209",
  "https://youtu.be/AzBLQXskqqU?si=dsblWdNR7StjeyWq": "https://uxplanet.org/ultimate-chatgpt-cheatsheet-for-ux-ui-designers-63c813fc859a",
  "https://youtu.be/d0ncngxVsXo": "https://medium.com/@ansyfkh/ui-ux-portofolio-zara-website-dd7a783470e6",
  "https://youtu.be/wrG9NEfSMUY": "https://uxplanet.org/forbes-app-ui-ux-redesign-case-study-6c40b686ec6c",
  "https://youtu.be/eac1Rx9yuH4": "https://www.behance.net/gallery/197159257/UIUX-Research-Spotify-App",
  "https://youtu.be/VVNhMDcShC8": "https://medium.com/muzli-design-inspiration/case-study-improving-a-banking-app-with-a-ux-audit-41d1155468df",
  "https://youtu.be/vGHpe_2sPG8": "https://medium.muz.li/ux-case-study-turning-a-100-year-old-bank-into-a-digital-innovator-5680a587e689",
  "https://www.youtube.com/watch?v=U7erGDnSNLk": "https://medium.com/design-bootcamp/ui-ux-case-study-unlocking-mental-wellness-zenlys-journey-of-seamless-journaling-and-crisis-a65b60040059",
  "https://youtu.be/oPJlnhhpfp8?si=9FX6ZtjDdsCAEzC8": "https://medium.com/design-bootcamp/the-future-of-podcasting-is-here-pocket-pod-a-case-study-in-ai-design-7541061ddcc6",
  "https://youtu.be/kOPI67m6A_s": "https://youtu.be/ruaitOBXN_U?si=G4vz-3JPso1obcBe",
  "https://youtu.be/usgvCdq_mwM": "https://medium.com/@stevanoreynerich.90210/netflix-case-study-adding-a-feature-691c44e7967f",
  "https://youtu.be/ivvUjnnJx1k": "https://medium.com/design-bootcamp/improving-search-experience-on-glassdoor-job-search-app-ux-ui-case-study-4e13afd61214",
  "https://youtu.be/1pnQvzE-aD8": "https://medium.com/@xuannyngo/ui-ux-case-study-steezy-app-redesign-c3c745d46abb",
  "https://youtu.be/3_5PoTKMMsc?si=9XT_yG4y8uIV_91S": "https://medium.com/as-a-product-designer/%E9%87%8D%E6%96%B0%E5%AE%9A%E7%BE%A9%E7%A7%BB%E5%8B%95%E9%AB%94%E9%A9%97-icu-%E5%9C%98%E9%9A%8A%E7%9A%84-bus-app-redesign-%E6%8E%A2%E9%9A%AA%E6%95%85%E4%BA%8B-acd3a63bd375",
  "https://youtu.be/eJOtkAMHEgc?si=9GkdA9eGw0Um8O4k": "https://medium.com/@joykaribo1/redesigning-the-opay-app-ui-ux-case-study-1ae64594a8ff",
  "https://youtu.be/2wzoKJIinLg": "https://medium.com/@flordaniele/gmail-ux-case-study-a-redesign-to-enhance-usability-and-accessibility-8a0c3f4ca53b",
  "https://www.youtube.com/watch?v=Ev72wcW6-9Q": "https://medium.com/@shuklaisha107/designing-for-patient-ease-creating-a-patient-first-app-for-anima-health-ac2429044e72",
  "https://www.youtube.com/watch?v=gZzDqcSJKKg": "https://loop11.medium.com/ai-for-ux-research-how-artificial-intelligence-is-changing-the-design-game-99c03a86683d",
  "https://youtu.be/SPTayyl4dHQ": "https://medium.com/@sasi21here/case-study-book-my-show-app-redesign-4e4470156843",
  "https://youtu.be/8gy-x4NdyD0?si=M4-oEa7Vipeej5GM": "https://medium.com/@minzxcv7/%E7%82%BA%E5%9C%96%E6%9B%B8%E9%A4%A8app%E9%87%8D%E6%96%B0%E8%A8%AD%E8%A8%88%E5%AE%8C%E5%96%84%E7%9A%84%E5%80%9F%E9%82%84%E6%9B%B8%E9%AB%94%E9%A9%97-e9ee43cbcb1e",
  "https://youtu.be/4Ly4XWgALGc": "https://www.qartech.com/zh-Hant/work/10000410",
  "https://youtu.be/PsoQLnJp5Xk": "https://medium.com/bootcamp/create-a-coupon-offer-system-on-the-cart-page-of-meesho-vrundar-patil",
  "https://youtu.be/ZyKDke2-3x8?si=TLlZzL1gZiRzVu9z": "https://medium.com/wayne-hsu/服務業櫃檯互動行銷的新契機-b2c行銷平台的ui-ux案例分析-a99128a941c4",
  "https://youtu.be/8ErUgA2wGdc?si=s5dxC2nTpycHSkNb": "https://medium.com/@jishnukartikeyan/improving-the-search-history-of-the-youtube-app-85debf19e1a0",
  "https://youtu.be/XCo_PTVg1FY": "https://rizkdlinee.medium.com/ui-ux-case-study-hr-system-be9d186c63af",
  "https://youtu.be/RwhM6B9l6pI": "https://medium.com/@irpan.maulana/case-study-ui-ux-design-for-a-parcel-delivery-app-6eeee4c9591e",
  "https://youtu.be/olqxPpxMRys": "https://medium.com/@fiqihfadillah15/ezlaundry-ui-ux-case-study-4c0600f16d3f",
  "https://youtu.be/95x8hEha3lc?si=XGDeRPLtxgd0ny8s": "https://medium.com/design-bootcamp/designing-a-genderless-shopping-experience-a-ux-ui-e-commerce-case-study-7cf332ce1661",
  "https://youtu.be/ERAjMEPOwHo": "https://medium.com/@workawayy/reimagining-customer-support-my-journey-designing-exotels-ai-chatbot-497d471e844c",
  "https://youtu.be/OXAXpsFzw6U": "https://medium.com/@krisnawrdn/ux-case-study-subscription-management-app-9b352e596c7",
  "https://youtu.be/XMKOwnGhyIY": "https://medium.com/anchis-design-stories/goodreads-%E9%87%8D%E6%96%B0%E8%A8%AD%E8%A8%88-%E8%A9%95%E4%BC%B0%E8%A1%8C%E7%82%BA%E7%9A%84%E6%94%B9%E8%AE%8A-5d72cf0265",
  "https://youtu.be/G1jIFZZRC6M?si=reqWfqXsHAQhaDZQ(": "https://medium.com/design-bootcamp/ai-in-logistics-a-quick-ux-and-ui-assignment-ppt-file-47190cdfca59",
  "https://youtu.be/-wWamDNcZqw": "https://medium.com/studentwork/ui-ux-case-study-ipusnas-library-app-redesign-2cde589bf309",
  "https://youtu.be/d3EXL8VEDxc": "https://medium.com/@shreeshashrestha/convenient-care-health-service-app-ui-ux-case-study",
  "https://youtu.be/7kQ2kHdEGJU": "https://uxplanet.org/ux-case-study-trekmate-a-mobile-experience-for-diy-trekkers-5c1b76b51147",
  "https://www.youtube.com/watch?v=Zg8l3LSChMU": "https://medium.com/@thedesigneuron/whats-wrong-with-apple-music-is-spotify-s-ux-the-benchmark-d2fea8ff8aa3",
  "https://youtu.be/ZA_V9-ZwZ5Q?feature=shared": "https://medium.com/design-bootcamp/voice-ui-vs-touch-ui-a-comparative-analysis-which-interface-is-the-future-855826ea6e46",
  "https://youtu.be/COxinxse1_k?si=-k2GcsSB33jOEp8I": "https://medium.com/@katesdarnell/goodreads-bookshelf-redesign-91b7eab38394",
  "https://youtu.be/KtYVphvaYF0": "https://medium.com/user-experience-design-1/transforming-ux-with-generative-ai-7b06ea329286",
  "https://youtu.be/uhBMCCxPzyA": "https://medium.com/design-bootcamp/instagram-x-ux-ui-redesign-case-study-34091c9dcae1",
  "https://youtu.be/ObIgVRmROno": "https://medium.com/design-bootcamp/enhancing-steams-navigation-to-increase-user-retention-product-design-case-study-72a165d9572f",
  "https://youtu.be/i_vkIKLpEsM": "https://medium.muz.li/case-study-ux-ui-design-development-for-storiaverse-ec246cd9062e",
  "https://youtu.be/kzQ__g6kjRM": "https://medium.com/design-bootcamp/restaurant-food-waste-management-app-design-ui-ux-case-study-4adb56d8e782",
  "https://youtu.be/Yg_EqAukLfo?si=vnI_5lpTRv-Tlb7VV": "https://medium.com/design-bootcamp/case-study-the-legend-of-zelda-a-link-to-the-past-ux-ui-redesign-10195f0a775",
  "https://youtu.be/nDTl8W8mRVQ": "https://medium.com/design-bootcamp/a-ux-exploration-of-animal-crossing-new-horizons-e7e504ebe351",
  "https://youtu.be/QNPid87Fpjk?feature=shared": "https://abduzeedo.com/node/88324",
  "https://youtu.be/2SsE9mDy8t4?feature=shared": "https://medium.com/design-bootcamp/how-curiosity-gap-ux-principle-fuels-social-media-stories-9d9ac7382d3d",
  "https://youtu.be/0_Oieknn_iU": "https://uxdesign.cc/game-ux-case-study-elden-ring",
  "https://youtu.be/ChZAnGDqW4g?si=GKN5TjQs_0q8CyNK": "https://medium.com/@senaguvel/case-study-designing-for-people-with-sensory-sensitivities-18b30fc8d37b",
  "https://youtu.be/siYUkuDmBWY": "https://medium.com/@arusharma/the-barnum-effect-in-product-management-9d59a4915048",
  "https://youtu.be/L16nHGqN83s": "https://medium.com/design-bootcamp/housify-web-and-mobile-app-re-design-hackathon-challenge-b34d8b2700a6",
  "https://youtu.be/ja5GmxkuRws": "https://medium.com/@zinobelky/swimmers-divided-the-ux-redesign-that-sparked-a-poolside-war-but-ultimately-won-d2f7f841240e",
  "https://youtu.be/5KiwRxI0ppo": "https://www.theuxda.com/blog/runrate-ux-case-study-financial-planning-platform-to-improve-financial-decisions",
  "https://youtu.be/sTa3oYoTw_c?si=owDdyyYXXOgQluH2": "https://medium.com/@isha-nadkarni/ux-case-study-tracking-office-shuttle-without-bookings-88b1146363bb",
  "https://youtu.be/xhQrG7cesy0": "https://medium.com/@1113b029/agoda-%E4%BB%8B%E9%9D%A2%E9%87%8D%E6%96%B0%E8%A8%AD%E8%A8%88-870be619aad8",
  "https://youtu.be/7B6yw0dxC7Q": "https://medium.com/@nerissaarvnas30/whatsapp-re-design-ui-ux-case-study-3d44febe25",
  "https://youtu.be/xoSoPA2_jAw": "https://www.behance.net/gallery/174112073/Flip-Memory-Game-Mobile-Game-UIUX-Design-Case-Study",
  "https://youtu.be/RV1rWl1-wrI": "https://www.uisdc.com/zsxq-operation",
  "https://youtu.be/oQj895HtuA0": "https://uxdesign.cc/how-uber-eats-makes-you-think-you-want-to-order-food-c943a9dbfb93",
  "https://youtu.be/xW-GHM1nGl0?si=-6PzVM_g-pXUpmjP": "https://medium.com/design-bootcamp/ux-case-study-cinescope-cinema-mobile-app-306d12f3fee9",
  "https://youtu.be/P6FPkl-YiiY": "https://www.behance.net/gallery/177483611/Redesign-Shopee-App-Case-UXUI",
  "https://youtu.be/mvbOT0LpzTE": "https://medium.com/@fariddept/ux-research-case-study-disney-hotstar-77908e55a371",
  "https://youtu.be/4Z3hsvfx5zs": "https://medium.com/@monikamaharana88/elevating-car-selling-experience-for-4lakh-users-on-cars24-app-c72a82598d49",
  "https://youtu.be/YZXSBIaERlo": "https://medium.com/@bhandarkarpari/minimizing-food-waste-a-ux-approach-to-smart-kitchen-management-0ade8301ee2a",
  "https://www.youtube.com/watch?v=5tTlQBWsCjA&t=27s": "https://medium.com/user-experience-design-1/bad-design-is-apparently-hot-fc71c08d381c",
  "https://youtu.be/M-8C3dV1ydo": "https://tubikstudio.medium.com/case-study-nova-post-ui-design-and-3d-for-interactive-christmas-advent-calendar-cc24776edea7",
  "https://youtu.be/4bFDawBZ6R0": "https://medium.com/design-bootcamp/improving-agodas-hotel-booking-experience-ux-ui-case-study-9e8df251dbd0",
  "https://youtu.be/5-3MJV8BWaQ": "https://www.behance.net/gallery/183329297/Travel-App-UX-case-study",
  "https://youtu.be/nKbzCoKmumA?si=epF5bfg95SSuLzgN": "https://medium.com/@lilia.mahmoudy7/case-study-creating-a-user-centric-travel-planning-website-part-5-825ab2b20948",
  
  // 樣本視頻URL映射 - 用於匹配sampleVideos.ts中的鏈接
  "https://www.youtube.com/watch?v=sample1": "https://medium.com/design-bootcamp/getting-started-with-ux-design-a-step-by-step-guide-b6d00fe3e4ff",
  "https://www.youtube.com/watch?v=sample2": "https://www.nngroup.com/articles/which-ux-research-methods",
  "https://www.youtube.com/watch?v=sample3": "https://uxplanet.org/prototyping-best-practices-in-2023-a-comprehensive-guide-8f764541d76c",
  "https://www.youtube.com/watch?v=sample4": "https://medium.com/design-bootcamp/design-systems-workshop-a-comprehensive-guide-to-scaling-design-8f863bedc531",
  "https://www.youtube.com/watch?v=sample5": "https://www.usability.gov/how-to-and-tools/methods/usability-testing.html",
  "https://www.youtube.com/watch?v=sample101": "https://medium.com/design-bootcamp/ux-case-study-improving-conversion-rates-by-75-with-minor-ux-changes-5ed087169dd0",
  "https://www.youtube.com/watch?v=sample102": "https://anyi-liang.medium.com/user-experience-case-study-trip-com-6dc5c5fa43ca",
  "https://www.youtube.com/watch?v=sample103": "https://bootcamp.uxdesign.cc/case-study-signals-revenue-f80fc5037d4f",
  "https://www.youtube.com/watch?v=sample104": "https://bootcamp.uxdesign.cc/case-study-redesigning-the-linkedin-mobile-app-to-improve-user-experience-c875f112abc",
  "https://www.youtube.com/watch?v=sample105": "https://uxplanet.org/ux-case-study-bbc-iplayer-87863daa666b",
  "https://www.youtube.com/watch?v=sample201": "https://medium.com/design-bootcamp/reimagining-chatgpt-ui-ux-redesign-case-study-a9927c171a1b",
  "https://www.youtube.com/watch?v=sample202": "https://medium.com/@beckhamza/the-secret-behind-apple-devices-rounded-corners-the-hidden-genius-of-ux-design-case-study-da609774e606",
  "https://www.youtube.com/watch?v=sample203": "https://medium.com/@yapmanying36/ui-ux-case-study-youtube-music-be0fe66eafb3",
  "https://www.youtube.com/watch?v=sample301": "https://medium.com/ux-planet/improving-valorant-e-sports-experience-ui-ux-case-study-37e36415a864",
  "https://www.youtube.com/watch?v=sample302": "https://medium.com/@lusyaanggrn/burger-king-mobile-app-redesign-ui-ux-case-study-1f8a0d5464d3",
  "https://www.youtube.com/watch?v=sample401": "https://medium.com/@jackalberttrew/generation-change-a-responsive-redesign-ux-ui-605b811c84f8",
  "https://www.youtube.com/watch?v=sample402": "https://medium.com/ux-planet/dominos-pizza-mobile-app-redesign-ui-ux-case-study-2174ada48876",
  "https://www.youtube.com/watch?v=sample601": "https://uxplanet.org/netflix-ux-case-study-designing-the-perfect-streaming-experience-b5f5a8239e90"
};

// 從YouTube URL提取視頻ID - 處理多種不同的URL格式
function extractVideoId(url: string): string {
  if (!url) return '';
  
  // 標準格式: youtube.com/watch?v=VIDEO_ID
  const watchRegex = /(?:youtube\.com\/watch\?v=)([^?&]+)/;
  const watchMatch = url.match(watchRegex);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1].split('?')[0].split('&')[0];
  }
  
  // 短鏈接格式: youtu.be/VIDEO_ID
  const shortRegex = /(?:youtu\.be\/)([^?&]+)/;
  const shortMatch = url.match(shortRegex);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1].split('?')[0].split('&')[0];
  }

  // 嵌入格式: youtube.com/embed/VIDEO_ID
  const embedRegex = /(?:youtube\.com\/embed\/)([^?&]+)/;
  const embedMatch = url.match(embedRegex);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1].split('?')[0].split('&')[0];
  }

  // 樣本視頻格式: sample1, sample2, etc.
  const sampleRegex = /sample(\d+)/;
  const sampleMatch = url.match(sampleRegex);
  if (sampleMatch) {
    return sampleMatch[0]; // 返回完整的 "sample123"
  }
  
  // 如果是已經是ID格式 (沒有域名等), 直接返回
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    return url;
  }
  
  // 最後嘗試從完整URL中提取
  return url;
}

// 建立視頻ID到文章URL的直接映射
const articleLinks: ArticleLinks = {};

// 填充 articleLinks，確保所有可能的視頻ID都有對應
for (const [videoUrl, articleUrl] of Object.entries(videoUrlToArticleMap)) {
  const videoId = extractVideoId(videoUrl);
  if (videoId) {
    articleLinks[videoId] = articleUrl;
  }
}

// 提供一個默認的文章鏈接URL
const DEFAULT_ARTICLE_URL = "https://medium.com/design-bootcamp/ux-ui-case-studies";

/**
 * 文章服務類
 * 提供與文章相關的功能
 */
class ArticleService {
  /**
   * 根據視頻ID或URL獲取對應的文章鏈接
   * @param videoIdOrUrl 視頻ID或URL
   * @returns 文章鏈接
   */
  getArticleLink(videoIdOrUrl: string): string {
    if (!videoIdOrUrl) {
      console.log("無效的視頻ID或URL");
      return DEFAULT_ARTICLE_URL;
    }

    // 優先級1: 直接使用videoUrlToArticleMap查找完整的URL匹配
    if (videoUrlToArticleMap[videoIdOrUrl]) {
      return videoUrlToArticleMap[videoIdOrUrl];
    }

    // 優先級2: 嘗試使用視頻ID從articleLinks查找
    const videoId = extractVideoId(videoIdOrUrl);
    if (articleLinks[videoId]) {
      return articleLinks[videoId];
    }

    // 優先級3: 模糊匹配，檢查任何URL是否包含此ID
    for (const [url, articleUrl] of Object.entries(videoUrlToArticleMap)) {
      const urlVideoId = extractVideoId(url);
      if (urlVideoId === videoId || urlVideoId.includes(videoId) || videoId.includes(urlVideoId)) {
        return articleUrl;
      }
    }

    // 兜底: 如果樣本視頻，尋找對應的樣本URL
    if (videoIdOrUrl.includes('sample')) {
      for (const [url, articleUrl] of Object.entries(videoUrlToArticleMap)) {
        if (url.includes(videoIdOrUrl)) {
          return articleUrl;
        }
      }
    }

    // 查找原始 URL 以應對 id 提取問題
    for (const [url, articleUrl] of Object.entries(videoUrlToArticleMap)) {
      if (url.includes(videoIdOrUrl) || videoIdOrUrl.includes(url)) {
        return articleUrl;
      }
    }

    console.log(`找不到視頻ID: ${videoIdOrUrl} 的文章鏈接，使用默認鏈接`);
    return DEFAULT_ARTICLE_URL;
  }
  
  /**
   * 檢查視頻是否有對應的文章
   * @param videoIdOrUrl 視頻ID或URL
   * @returns 是否有對應文章
   */
  hasArticle(videoIdOrUrl: string): boolean {
    if (!videoIdOrUrl) return false;

    // 檢查完整 URL
    if (videoUrlToArticleMap[videoIdOrUrl]) {
      return true;
    }

    // 檢查視頻 ID
    const videoId = extractVideoId(videoIdOrUrl);
    if (articleLinks[videoId]) {
      return true;
    }

    // 模糊匹配
    for (const [url, _] of Object.entries(videoUrlToArticleMap)) {
      const urlVideoId = extractVideoId(url);
      if (urlVideoId === videoId || urlVideoId.includes(videoId) || videoId.includes(urlVideoId)) {
        return true;
      }
    }

    // 模糊URL匹配
    for (const [url, _] of Object.entries(videoUrlToArticleMap)) {
      if (url.includes(videoIdOrUrl) || videoIdOrUrl.includes(url)) {
        return true;
      }
    }

    // 樣本視頻檢查
    if (videoIdOrUrl.includes('sample')) {
      for (const [url, _] of Object.entries(videoUrlToArticleMap)) {
        if (url.includes(videoIdOrUrl)) {
          return true;
        }
      }
    }

    return false;
  }
  
  /**
   * 根據視頻URL獲取文章鏈接
   * @param videoUrl 完整的YouTube視頻URL
   * @returns 文章URL
   */
  getArticleLinkByVideoUrl(videoUrl: string): string {
    return this.getArticleLink(videoUrl);
  }
  
  /**
   * 輸出當前映射的調試信息
   * 用於檢查文章映射是否正確
   */
  debugMappings(): void {
    console.log("===== 視頻URL到文章URL映射 =====");
    console.log(`映射數量: ${Object.keys(videoUrlToArticleMap).length}`);
    
    console.log("===== 視頻ID到文章URL映射 =====");
    console.log(`映射數量: ${Object.keys(articleLinks).length}`);
    
    // 檢查各種樣本視頻ID
    console.log("===== 樣本視頻測試 =====");
    const sampleIds = ['sample1', 'sample201', 'sample401'];
    for (const id of sampleIds) {
      console.log(`視頻ID: ${id}, 文章URL: ${this.getArticleLink(id)}`);
    }
  }
}

// 導出文章服務實例
const articleService = new ArticleService();

// 初始化時確保 articleLinks 已被填充
console.log(`ArticleService initialized with ${Object.keys(articleLinks).length} article links.`);

export { articleService };
export default articleService; 