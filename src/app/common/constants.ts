import { environment } from "../../environments/environment.development";


export const CONSTANTS = {

  languageJSON:[
    {
      value:"english",
      name:'English',
      imgUrl:'./assets/images/country-img/us.png'
    },
    // {
    //   value:"gujarati",
    //   name:'Gujarati',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    {
      value:"hindi",
      name:'Hindi',
      imgUrl:'./assets/images/country-img/in.png'
    },
    // {
    //   value:"in-bengali",
    //   name:'Bengali',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"marathi",
    //   name:'Marathi',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-telugu",
    //   name:'Telugu',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-tamil",
    //   name:'Tamil',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-kannada",
    //   name:'Kannada',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-odia",
    //   name:'Odia',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-malayalam",
    //   name:'Malayalam',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-panjabi",
    //   name:'Panjabi',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"in-kashmiri",
    //   name:'Kashmiri',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"np-nepali",
    //   name:'Nepali',
    //   imgUrl:'./assets/images/country-img/in.png'
    // },
    // {
    //   value:"sp-spanish",
    //   name:'Spain',
    //   imgUrl:'./assets/images/country-img/spain.png'
    // },
    // {
    //   value:"ml-malaya",
    //   name:'Malay',
    //   imgUrl:'./assets/images/country-img/indonesia.png'
    // },
    // {
    //   value:"ep-french",
    //   name:'French',
    //   imgUrl:'./assets/images/country-img/france.png'
    // },
    // {
    //   value:"rs-russian",
    //   name:'Russia',
    //   imgUrl:'./assets/images/country-img/russia.png'
    // },
    // {
    //   value:"ge-germany",
    //   name:'Germany',
    //   imgUrl:'./assets/images/country-img/germany.png'
    // },
    // {
    //   value:"eu-portuguese",
    //   name:'Portuguese',
    //   imgUrl:'./assets/images/country-img/portugal.png'
    // },
    // {
    //   value:"tk-turkish",
    //   name:'Turkey',
    //   imgUrl:'./assets/images/country-img/turkey.png'
    // },
  ],

  message: {
    INITIAL: 'Please enter search criteria and hit search button.',
    INTERNAL_ERROR: 'Oops Something went wrong..!',
    INTERNAL_SERVER_ERROR: 'Oops Internal Server error..!',
    NETWORK_ERROR: 'Oops! Connection/Network error..!'
  },

  errorCodes: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND_HTTP_EXCEPTION: 404,
    PERMISSION_DENIED: 404,
    METHOD_NOT_FOUND: 405,
    ALREADY_EXISTS: 406,
    DATABASE_INITIALIZATION_FAIL: 407,
    ERROR_CODE_VALIDATION_FAILED: 422,
    INVALID_DOMAIN: 433,
    TOKEN_EXPIRED: 466,
    TOKEN_REQUIRED: 477,
    INTERNAL_SERVER_ERROR: 500
  },

  // googleLoginClientID : '381684232945-ajl08cpscarqe6ln5634h8v4j23gn588.apps.googleusercontent.com', //localhost
  googleLoginClientID : '967870721959-n2ah899bpgsc6blun3bllo5888qmvaol.apps.googleusercontent.com',
  baseImageUrl:environment.baseImageURL,
  appUrl:environment.appURL,
  defaultImage: './assets/images/dummy-image.webp',
  defaultProductImage: './assets/images/dummy-product.webp',
  loadingGif: './assets/images/magic_hair.gif',
  logo: './assets/images/logo.webp',
  isShippingCharge: 50,

  // razorpayKeyId:'rzp_test_xLCgO4y8whu5mi', //test
  razorpayKeyId:'rzp_live_iHbyVn589aKEAn', // live

  imagearray: ['image/avif', 'image/webp', 'image/webp', 'image/jpeg', 'image/gif', 'image/bmp', 'image/vnd.microsoft.icon', 'image/tiff', 'image/svg+xml'],

  videoarray: ['video/x-f4v','video/x-matroska','video/x-msvideo', 'video/mp4', 'video/webm', 'audio/webm', 'video/3gpp', 'audio/3gpp', 'video/3gpp2', 'audio/3gpp2', 'video/x-ms-wmv', 'video/quicktime', 'video/MP2T', 'video/x-flv'],

  docarray: ['application/zip', 'text/plain', 'application/vnd.rar', 'application/pdf', 'text/csv',
    'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
    'application/x-tar', 'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.text',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-7z-compressed'
  ],

  homePageMetaTag : {
    title           :"100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care",
    description     :"100% Ayurvedic & natural hair care Shampoo Mix Powder. Nourish, protect, and revitalize your hair with chemical-free ingredients, Magics Hair Care.",
    keywords        :"100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care",
    robots          :"index, follow",
    googlebot:"index,follow",
    googlebot1:"index, follow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"index, follow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"index, follow",
    "msnbot":"index,follow",
    "rating":"general",
    'Content-Type'  :"text/html; charset=utf-8",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },
 
  homePageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care",
    'og:site_name' : "Magicshaircare",
    'og:url'        :"https://magicshaircare.com/",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"100% Ayurvedic & natural hair care Shampoo Mix Powder. Nourish, protect, and revitalize your hair with chemical-free ingredients, Magics Hair Care.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  homePageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care",
    'twitter:site'        :"@magicshair12",
    'twitter:creator'          :"@magicshair12",
    'twitter:description'  :"100% Ayurvedic & natural hair care Shampoo Mix Powder. Nourish, protect, and revitalize your hair with chemical-free ingredients, Magics Hair Care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic | Natural Shampoo Mix Powder | Magics Hair Care"
  },

  shopPageMetaTag : {
    title           :"Shop Ayurvedic Hair Care Mix – Stop Hair Loss & Irritation for All.",
    description     :"Magics Hair Care’s Ayurvedic mix is 100% natural, designed to stop hair loss, nourish, and protect. This Product is Perfect for Men, Women & Children.",
    keywords        :"Ayurvedic, Natural Hair Care Products, Magics Hair Care",
    robots          :"index, follow",
    'Content-Type'  :"text/html; charset=utf-8",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics hiar care",
    copyright       :"Magics hair care",
  },

  shopPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Shop Ayurvedic Hair Care Mix – Stop Hair Loss & Irritation for All.",
    'og:url'        :"https://magicshaircare.com/shop",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Magics Hair Care’s Ayurvedic mix is 100% natural, designed to stop hair loss, nourish, and protect. This Product is Perfect for Men, Women & Children.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  shopPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Shop Ayurvedic Hair Care Mix – Stop Hair Loss & Irritation for All.",
    'twitter:site'        :"@https://magicshaircare.com/shop",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Magics Hair Care’s Ayurvedic mix is 100% natural, designed to stop hair loss, nourish, and protect. This Product is Perfect for Men, Women & Children.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"Shop Ayurvedic Hair Care Mix | Shop For Men, Women, Children, Magics Hair Care."
  },

  aboutUsPageMetaTag : {
    title           :"About Us | Pure Natural & Ayurvedic Powder Mix Hair Care Product.",
    description     :"At Magic Hair Care, we believe in being a Truly Organic Brand. We are an organic haircare brand that believes in the power of nature and Ayurveda.",
    keywords        :"Ayurvedic, Natural Hair Care Products, Magicshaircare",
    robots          :"index, follow",
    'Content-Type'  :"text/html; charset=utf-8",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics hiar care",
    copyright       :"Magics hair care",
  },

  aboutUsPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"About Us | Pure Natural & Ayurvedic Powder Mix Hair Care Product",
    'og:url'        :"https://magicshaircare.com/aboutus",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"At Magic Hair Care, we believe in being a Truly Organic Brand. We are an organic haircare brand that believes in the power of nature and Ayurveda.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  aboutUsPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"About Us | Pure Natural & Ayurvedic Powder Mix Hair Care Product",
    'twitter:site'        :"@https://magicshaircare.com/aboutus",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"At Magic Hair Care, we believe in being a Truly Organic Brand. We are an organic haircare brand that believes in the power of nature and Ayurveda.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic | Natural Hair Care Mix Powder | Magics Hair Care"
  },

  blogPageMetaTag : {
    title           :"Our Story - The Evolution of Magics Hair Care's Natural Products.",
    description     :"Magics Hair Care offers natural, Ayurvedic solutions for healthy hair. Committed to quality, we provide holistic products to nourish and revitalize your hair.",
    keywords        :"Ayurvedic, Natural Hair Care Products, Magics Hair Care",
    robots          :"index, follow",
    'Content-Type'  :"text/html; charset=utf-8",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics hiar care",
    copyright       :"Magics hair care",
  },

  blogPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Our Story - The Evolution of Magics Hair Care's Natural Products.",
    'og:url'        :"https://magicshaircare.com/stories",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Magics Hair Care offers natural, Ayurvedic solutions for healthy hair. Committed to quality, we provide holistic products to nourish and revitalize your hair.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  blogPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Commit to Healthy Hair | Explore Our Plans | Msgics Hair Care",
    'twitter:site'        :"@https://magicshaircare.com/stories",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Infuse your hair with the power of Ayurveda for enhanced strength and shine. Commit to hair vitality with Magics Hair Care! Check our plans today!",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic | Natural Hair Care Mix Powder, Magics Hair Care"
  },

  subscriptionPageMetaTag : {
    title           :"100% Ayurvedic Healthy Hair, Explore Our Plans, Magics Hair Care",
    description     :"Infuse your hair with the power of Ayurveda for enhanced strength and shine. Commit to hair vitality with Magics Hair Care! Check our plans today!",
    keywords        :"100% Ayurvedic Healthy Hair | Natural Shampoo Mix Powder | Magics Hair Care",
    robots          :"index, follow",
    googlebot:"index,follow",
    googlebot1:"index, follow, max-snippet:-1, max-image-preview:large",
    'Googlebot' : "index, follow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image' : "max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    'Content-Type'  :"text/html; charset=utf-8",
    yahoobot: "index, follow",
    msnbot:"index,follow",
    rating:"general",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics hiar care",
    copyright       :"Magics hair care",
  },

  subscriptionPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"100% Ayurvedic Healthy Hair, Explore Our Plans, Magics Hair Care",
    'og:site_name'     :"Magicscare",
    'og:url'        :"https://magicshaircare.com/subscription",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Infuse your hair with the power of Ayurveda for enhanced strength and shine. Commit to hair vitality with Magics Hair Care! Check our plans today!",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },  

  subscriptionPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"100% Ayurvedic & Natural Hair Care Mix Powder | Magics Hair Care",
    'twitter:site'        :"@https://magicshaircare.com/subscription",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"100% Ayurvedic & natural hair care powder. Nourish, protect, and revitalize your hair with chemical-free ingredients, Magics Hair Care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Use For Men, Women, Children| Magics Hair Care"
  },

  contactUsPageMetaTag : {
    title           :"Contact Us | For More Enquiry Give Us Call on 18008892066",
    description     :"Magics Hair Care | For More queries reach us at info@magicsindia.com, Contact Us On Toll-free Number 18008892066",
    keywords        :"Magics Hair Care, info@magicsindia.com,Toll-free Number 18008892066",
    robots          :"index, follow",
    'Content-Type'  :"text/html; charset=utf-8",
    language        :"English",
    'revisit-after' :"1 days",
    author          :"Magics hiar care",
    copyright       :"Magics hair care",
  },

  contactUsPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Contact Us | For More Enquiry Give Us Call on 18008892066",
    'og:url'        :"https://magicshaircare.com/contactus",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp  ",
    'og:description'  :"Magics Hair Care | For More queries reach us at info@magicsindia.com, Contact Us On Toll-free Number 18008892066",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },  

  contactUsPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"100% Ayurvedic & Natural Hair Care Mix Powder | Magics Hair Care",
    'twitter:site'        :"@https://magicshaircare.com/contactus",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Magics Hair Care | For More queries reach us at info@magicsindia.com, Contact Us On Toll-free Number 18008892066",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Contact Us On Toll-free Number 18008892066 | Magics Hair Care"
  },

  benifitPageMetaTag : {
    title           :"Discover the Magic of Healthy & Natural Hair with Magics Hair Care",
    description     :"Try Our secret to strong, shiny, and beautiful hair with our 100% natural & Ayurvedic chemical-free Shampoo Mix Powder. Magics Hair Care, Try it Now.",
    keywords        :"100% Ayurvedic & Natural | Chemical-free Shampoo Mix Powder | Magics Hair Care",
    robots          :"index, follow",
    googlebot:"index, follow, max-snippet:-1, max-image-preview:large",
    googlebot1:"index, follow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"index, follow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"index, follow",
    "msnbot":"index,follow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  benifitPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Discover the Magic of Healthy & Natural Hair with Magics Hair Care.",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/benefits",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Try Our secret to strong, shiny, and beautiful hair with our 100% natural & Ayurvedic chemical-free Shampoo Mix Powder. Magics Hair Care, Try it Now.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  benifitPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Discover the Magic of Healthy & Natural Hair with Magics Hair Care",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Try Our secret to strong, shiny, and beautiful hair with our 100% natural & Ayurvedic chemical-free Shampoo Mix Powder. Magics Hair Care, Try it Now.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Shampoo Mix Powder | Magics Hair Care"
  },

  reviewPageMetaTag : {
    title           :"Give Us your Valuables Reviews!.",
    description     :"See what our happy customers are saying about us. Read their stories and discover why Magics Hair Care is the go-to choice for natural hair care.",
    keywords        :"Review-Product | Review Now | Magics Hair Care",
    robots          :"noindex, nofollow",
    googlebot:"noindex,nofollow",
    googlebot1:"noindex, nofollow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"noindex, nofollow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"noindex, nofollow",
    "msnbot":"noindex,nofollow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  reviewPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Give Us your Valuables Reviews!",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/review/productreview",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"See what our happy customers are saying about us. Read their stories and discover why Magics Hair Care is the go-to choice for natural hair care.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  reviewPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Give Us your Valuables Reviews!",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"See what our happy customers are saying about us. Read their stories and discover why Magics Hair Care is the go-to choice for natural hair care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Give us Your Review | Magics Hair Care"
  },
 
  cartListPageMetaTag : {
    title           :"Your Hair Care Essentials Are Just a Click Away!",
    description     :"Review your selections, complete your purchase, and get ready to experience the magic of Ayurvedic hair care. Magics Hair Care.",
    keywords        :"100% Ayurvedic & Natural | Chemical-free Shampoo Mix Powder | Magics Hair Care",
    robots          :"noindex, nofollow",
    googlebot:"noindex,nofollow",
    googlebot1:"noindex, nofollow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"noindex, nofollow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"noindex, nofollow",
    "msnbot":"noindex,nofollow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  cartListPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Your Hair Care Essentials Are Just a Click Away!",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/cartlist",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Review your selections, complete your purchase, and get ready to experience the magic of Ayurvedic hair care. Magics Hair Care.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  cartListPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Your Hair Care Essentials Are Just a Click Away!",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Review your selections, complete your purchase, and get ready to experience the magic of Ayurvedic hair care. Magics Hair Care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Cart - List| Magics Hair Care"
  },

  tncPageMetaTag : {
    title           :"Clear & Simple",
    description     :"Our guidelines for a smooth shopping experience. Know your rights, our responsibilities, and everything in between, made easy to understand.",
    keywords        :"Terms & Conditions | Simple & Clear | Magics Hair Care",
    robots          :"noindex, nofollow",
    googlebot:"noindex,nofollow",
    googlebot1:"noindex, nofollow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"noindex, nofollow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"noindex, nofollow",
    "msnbot":"noindex,nofollow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  tncPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Clear & Simple",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/termsandcondition",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Our guidelines for a smooth shopping experience. Know your rights, our responsibilities, and everything in between, made easy to understand.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },


  tncPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Clear & Simple",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Our guidelines for a smooth shopping experience. Know your rights, our responsibilities, and everything in between, made easy to understand.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Terms & Conditions | Magics Hair Care"
  },

  supportPageMetaTag : {
    title           :"We're Here to Help",
    description     :"Got questions? We're just a click away! Get quick answers, advice, and assistance with all your hair care needs.",
    keywords        :"Suport | 100% Ayurvedic | Magics Hair Care",
    robots          :"index, follow",
    googlebot:"index,follow",
    googlebot1:"index, follow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"index, follow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"index, follow",
    "msnbot":"index,follow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  supportPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"We're Here to Help",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/support/",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"Got questions? We're just a click away! Get quick answers, advice, and assistance with all your hair care needs.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  supportPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"We're Here to Help",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Got questions? We're just a click away! Get quick answers, advice, and assistance with all your hair care needs.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Suport | Magics Hair Care"
  },

  privacyPageMetaTag : {
    title           :"We're Here to Help",
    description     :"We protect your personal information like it's our own. Read about how we keep your data safe and secure every step of the way. Magics Care",
    keywords        :"Privacy-Policy | Your data your trust | Magics Hair Care",
    robots          :"noindex, nofollow",
    googlebot:"noindex,nofollow",
    googlebot1:"noindex,nofollow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"noindex,nofollow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"noindex,nofollow",
    "msnbot":"noindex,nofollow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  privacyPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Your Data, Your Trust",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/privacypolicy/",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"See what our happy customers are saying about us. Read their stories and discover why Magics Hair Care is the go-to choice for natural hair care.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  privacyPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Your Data, Your Trust",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Review your selections, complete your purchase, and get ready to experience the magic of Ayurvedic hair care. Magics Hair Care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Shampoo Mix Powder | Magics Hair Care"
  },


  wishlistPageMetaTag : {
    title           :"Save Your Faves",
    description     :"Keep all your favorite products in one spot. Easily add, edit, and purchase whenever you're ready to treat your hair to the best! Magics Hair Care.",
    keywords        :"Review-Product | Review Now | Magics Hair Care",
    robots          :"noindex,nofollow",
    googlebot:"noindex,nofollow",
    googlebot1:"inoindex,nofollow, max-snippet:-1, max-image-preview:large",
    'Googlebot':"noindex,nofollow, max-snippet:100, max-image-preview:standard, max-image-preview:large",
    'Googlebot-Image':"max-image-preview:standard, max-image-preview:large",
    'Googlebot-Video' : "max-video-preview:-1",
    "yahoobot":"noindex,nofollow",
    "msnbot":"noindex,nofollow",
    "rating":"general",
    author          :"Magics Hair Care",
    copyright       :"Magics Hair Care",
  },

  wishlistPageMetaOgTag : {
    'og:type'           :"website",
    'og:title'     :"Save Your Faves",
    'og:site_name' : "Magicscare",
    'og:url'        :"https://magicshaircare.com/wishlist/",
    'og:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'og:description'  :"See what our happy customers are saying about us. Read their stories and discover why Magics Hair Care is the go-to choice for natural hair care.",
    'og:image:width'  :"80",
    'og:image:height' :"80"
  },

  wishlistPageMetaTwitterTag : {
    'twitter:card'           :"summary_large_image",
    'twitter:title'     :"Save Your Faves",
    'twitter:site'        :"@Magicshaircare",
    'twitter:creator'          :"@Magicshaircare",
    'twitter:description'  :"Keep all your favorite products in one spot. Easily add, edit, and purchase whenever you're ready to treat your hair to the best! Magics Hair Care.",
    'twitter:image'          :"https://magicshaircare.com/assets/images/Logo2.webp",
    'twitter:image:alt' :"100% Ayurvedic & Natural | Wish - List | Magics Hair Care"
  },
  
  homeBreadcrum : {
    "@context": "http://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://magicshaircare.com/"
      }
    ]
  },

  shopBreadcrum : {
    "@context": "http://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [
            {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://magicshaircare.com/"
            },
            {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Shop",
                    "item": "https://magicshaircare.com/shop"
            }
    ]
},


storyBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
          {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://magicshaircare.com/"
          },
          {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Stories",
                  "item": "https://magicshaircare.com/stories"
          }
  ]
},

planBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
          {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://magicshaircare.com/"
          },
          {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Stories",
                  "item": "https://magicshaircare.com/subscription"
          }
  ]
},

subscriptionBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
          {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://magicshaircare.com/"
          },
          {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Subscription",
                  "item": "https://magicshaircare.com/subscription"
          }
  ]
},

aboutusBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
          {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://magicshaircare.com/"
          },
          {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "AboutUs",
                  "item": "https://magicshaircare.com/aboutus"
          }
  ]
},

contactusBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [
          {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://magicshaircare.com/"
          },
          {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "ContactUs",
                  "item": "https://magicshaircare.com/contactus"
          }
  ]
},

benifitBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":  [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "benefits",
            "item": "https://magicshaircare.com/benefits"
    }
]
},


reviewBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":   [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "productreview",
            "item": "https://magicshaircare.com/productreview"
    }
]
},

cartListBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":   [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "cartlist",
            "item": "https://magicshaircare.com/cartlist"
    }
]
},

tncBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":    [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "termsandcondition",
            "item": "https://magicshaircare.com/termsandcondition"
    }
]
},

supportBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":     [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "support/",
            "item": "https://magicshaircare.com/support/"
    }
]
},

privacyBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":  [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "privacypolicy",
            "item": "https://magicshaircare.com/privacypolicy/"
    }
]
},

wishlistBreadcrum : {
  "@context": "http://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement":  [
    {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://magicshaircare.com/"
    },
    {
            "@type": "ListItem",
            "position": 2,
            "name": "wish-list/",
            "item": "https://magicshaircare.com/wishlist/"
    }
]
},

homeWebsiteSchema : {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Magicshaircare",
  "url": "https://www.magicshaircare.com/"
},

// shopWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Shop",
//   "alternateName": ["Shop the Magics", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/shop",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/shop?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// storyWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Tips & Tricks",
//   "alternateName":  ["Stories"],
//   "url": "https://magicshaircare.com/stories",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/stories?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// subscriptionWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Explore Our Plan",
//   "alternateName": ["Subscription", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/subscription",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/subscription/search?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },


// galleryWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Gallery",
//   "alternateName": ["Gallery", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/gallery",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/gallery?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// aboutusWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "About-Us",
//   "alternateName": ["About Magics"],
//   "url": "https://magicshaircare.com/aboutus",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/aboutus?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// contactusWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Contact-Us",
//   "alternateName": ["Contact-Us"],
//   "url": "https://magicshaircare.com/contactus",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/contactus?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// benifitWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Benefits",
//   "alternateName": ["Benefits", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/benefits",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/benefits?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// reviewWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Product-review",
//   "alternateName": ["Product-review", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/review/productreview",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/review/productreview?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// cartListWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Cart-list",
//   "alternateName": ["Cart - list", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/cartlist",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/cartlist?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// tncWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Terms & Conditions",
//   "alternateName": ["Terms & Conditions", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/termsandcondition",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/termsandcondition?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// supportWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Support",
//   "alternateName": ["Support", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/support/",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/support?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// privacyWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Privacy-Policy",
//   "alternateName": ["Privacy - Policy", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/privacypolicy/",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/privacypolicy?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

// wishlistWebsiteSchema : {
//   "@context": "https://schema.org/",
//   "@type": "WebSite",
//   "name": "Magics Hair Care - Wish-list",
//   "alternateName":  ["Wish - list", "Magics Hair Care"],
//   "url": "https://magicshaircare.com/wish-list/",
//   "potentialAction": {
//     "@type": "SearchAction",
//     "target": "https://magicshaircare.com/wishlist?q={search_term_string}",
//     "query-input": "required name=search_term_string"
//   }
// },

homeLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

shopLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/shop",
   "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

storyLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/stories",
   "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

subscriptionLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/subscription",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

galleryLBSchema : {
"@context": "https://schema.org",
"@type": "LocalBusiness",
"name": "Magicshaircare",
"image": "https://magicshaircare.com/assets/images/Logo2.webp",
"@id": "",
"url": "https://magicshaircare.com/gallery",
"telephone": "+91 8160713636",
"address": {
  "@type": "PostalAddress",
  "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
  "addressLocality": "Surat",
  "postalCode": "395009",
  "addressCountry": "IN"
},
"geo": {
  "@type": "GeoCoordinates",
  "latitude": 21.1940293,
  "longitude": 72.7866203
} ,
"sameAs": [
  "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
  "https://x.com/magicshair12",
  "https://www.instagram.com/magics_haircare_india/?hl=en",
  "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
  "https://in.pinterest.com/navyaglobal6/"
] 
},


aboutusLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/aboutus",
   "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

contactusLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/contactus",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

benifitLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/benefits",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

reviewLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/review/productreview",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

cartListLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/cartlist",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

tncLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/termsandcondition",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

supportLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/support/",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

privacyLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/privacypolicy/",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

wishlistLBSchema : {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Magicshaircare",
  "image": "https://magicshaircare.com/assets/images/Logo2.webp",
  "@id": "",
  "url": "https://magicshaircare.com/wish-list/",
  "telephone": "18008892066",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "22 - Janki Row House, near TGB Circle, L.P Savani Road",
    "addressLocality": "Surat",
    "postalCode": "395009",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.1940293,
    "longitude": 72.7866203
  } ,
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

homeOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

shopOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/shop",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

storiesOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/stories",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

subscriptionOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/subscription",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

aboutusOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/aboutus",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

contactusOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/contactus",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

benifitOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/benefits",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

reviewOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/review/productreview",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

cartListOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/cartlist",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

tncOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/termsandcondition",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

supportOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/support/",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

privacyOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName":"Magics Hair Care",
  "url": "https://magicshaircare.com/privacypolicy/",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magics_haircare_india/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ] 
},

wishlistOrgSchema : {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magicshaircare",
  "alternateName": "Magics Hair Care",
  "url": "https://magicshaircare.com/wish-list/",
  "logo": "https://magicshaircare.com/assets/images/Logo2.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "18008892066",
    "contactType": "customer service",
    "contactOption": "TollFree",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com/people/Magics-hair-care/61561881912760/?sk=photos_by",
    "https://x.com/magicshair12",
    "https://www.instagram.com/magicscare_official/?hl=en",
    "https://www.youtube.com/channel/UCOtgwj0uIxmJ7KIMvBZDYRQ",
    "https://in.pinterest.com/navyaglobal6/"
  ]
},

}