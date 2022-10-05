// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIUrl: "http://localhost:17001",

  authorizeURL: 'https://apitest.authorize.net/xml/v1/request.api',
  transactionLogin: '6LrckQ3F3MZ9',
  transactionKey: '525Gk3FQge24EuVY',

  defaultWebsite: "http://localhost:4200",

  emailPattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$",
  fontSize: 75,
  fontFamily: [
    { displayName: "serif", value: "serif" },
    { displayName: "MoonTime-Regular", value: "MoonTime-Regular" },
    { displayName: "cursive", value: "cursive" },
    { displayName: "Verdana", value: "Verdana" },
  ],
  fontStyleList: [
    { displayName: "regular", value: "regular" },
    { displayName: "italic", value: "italic" },
    { displayName: "bold", value: "bold" },
    { displayName: "bold italic", value: "bold italic" },
    { displayName: "underline", value: "underline" },
  ],
  fontLineHeight: 30,
  order: [
    { number: 0, value: 0 },
    { number: 1, value: 1 },
    { number: 2, value: 2 },
    { number: 3, value: 3 },
  ],
  fbAppId: "738993143334602",
  linkedinLoginUrl:
    "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86l5270scfeote&redirect_uri=http://localhost:4200/&state=987654321&scope=w_member_social+r_liteprofile+r_emailaddress",
  instagramLoginUrl:
    "https://api.instagram.com/oauth/authorize?client_id=312505673322106&redirect_uri=https://localhost:4200&scope=user_profile,user_media&response_type=code",
  // froalaEditorKey:
  //   "iTB2xC2C4D4A1A1B1wd1DBKSPF1WKTUCQOa1OURPJ1KDe2F-11D2C2D2H2C3A3B2D6C1C2==",
  froalaEditorKey: {
    key:
      "iTB2xC2C4D4A1A1B1wd1DBKSPF1WKTUCQOa1OURPJ1KDe2F-11D2C2D2H2C3A3B2D6C1C2==",
    charCounterCount: false,
    // height: 300,
    // inlineMode: false,
    // heightMin: 10,
    // heightMax: 550,
    fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '40', '45', '50', '55', '60'],
    fontFamily: {
      "'Alex Brush',sans-serif": "Alex Brush",
      "Allura,sans-serif": "Allura",
      "Arial, Helvetica, sans-serif": "Arial",
      "Arial Black, Gadget, sans-serif": "Arial Black",
      "Barlow,sans-serif": "Barlow",
      "Bad Script": "Bad Script",
      "Brush Script MT, sans-serif": "Brush Script San",
      "'Cedarville Cursive',sans-serif": "Cedarville Cursive",
      "'Clicker Script',sans-serif": "Clicker Script",
      "Comic Sans MS, cursive, sans-serif": "Comic Sans MS",
      "Courier New, Courier, monospace": "Courier New",
      "'Dancing Script',sans-serif": "Dancing Script",
      "'Dawning of a New Day',sans-serif": "Dawning of a New Day",
      "Dosis,sans-serif": "Dosis",
      "Georgia, serif": "Georgia",
      "'Great Vibes',sans-serif": "Great Vibes",
      "Helvetica, serif": "Helvetica",
      "'Homemade Apple',sans-serif": "Homemade Apple",
      "Impact, Charcoal, sans-serif": "Impact, Charcoal",
      "Kristi,sans-serif": "Kristi",
      "'La Belle Aurore',sans-serif": "La Belle Aurore",
      "'Liu Jian Mao Cao',sans-serif": "Liu Jian Mao Cao",
      "Lucida Sans Unicode, Lucida Grande, sans-serif": "Lucida Sans,Grande",
      "'Maven Pro',sans-serif": "Maven Pro",
      "Montserrat,sans-serif": "Montserrat",
      "'Open Sans Condensed',sans-serif": "Open Sans Condensed",
      "Parisienne,sans-serif": "Parisienne",
      "'Petit Formal Script',sans-serif": "Petit Formal Script",
      "'Poiret One',sans-serif": "Poiret One",
      "Quicksand,sans-serif": "Quicksand",
      "Roboto,sans-serif": "Roboto",
      "Sacramento,sans-serif": "Sacramento",
      "Satisfy,sans-serif": "Satisfy",
      "Shadows Into Light": "Shadows Into Light",
      "'Source Sans Pro',sans-serif": "Source Sans Pro",
      "Srisakdi,sans-serif": "Srisakdi",
      "Tahoma, Geneva, sans-serif": "Tahoma, Geneva",
      "Times New Roman, Times, serif": "Times New Roman",
      "Trebuchet MS, Helvetica, sans-serif": "Trebuchet,Helvetica",
      "Verdana, Geneva, sans-serif": "Verdana,Geneva",
      "'Work Sans',sans-serif": "Work Sans",
      "Zeyada,sans-serif": "Zeyada",

    },
    fontFamilySelection: true,
    htmlAllowedEmptyTags: ['textarea', 'a', 'iframe', 'object', 'video', 'style', 'script', '.fa', 'span', 'p', 'path', 'line'],
    htmlAllowedTags: ['.*'],
    htmlAllowedAttrs: ['.*'],
    htmlRemoveTags: ['script'],
    attribution: false,
    videoUpload: false,
    toolbarButtons: {
      moreText: {
        buttons: [
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "fontFamily",
          "fontSize",
          "textColor",
          "backgroundColor",
          "insert",
          "inlineClass"
        ],
      },
      moreParagraph: {
        buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
      },
      moreRich: {
        buttons: [
          "insertLink",
          "insertImage",
          "insertTable",
          "insertVideo",
          "emoticons",
          "fontAwesome",
          "specialCharacters",
          "embedly",
          // "insertFile",
          "insertHR",
        ],
      }, moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help']
      }
    },
    // Colors list.
    colorsBackground: [
      '#641E16', '#7B241C', '#922B21', '#A93226', '#C0392B', '#CD6155', '#D98880', '#E6B0AA', '#F2D7D5',
      '#633974', '#76448A', '#884EA0', '#9B59B6', '#AF7AC5', '#C39BD3', '#D7BDE2', '#F4ECF7', '#F5EEF8',
      '#154360', '#1A5276', '#1F618D', '#2471A3', '#2980B9', '#5499C7', '#7FB3D5', '#A9CCE3', '#D4E6F1',
      '#0E6251', '#148F77', '#138D75', '#16A085', '#45B39D', '#73C6B6', '#76D7C4', '#A3E4D7', '#D1F2EB',
      '#145A32', '#196F3D', '#1E8449', '#229954', '#27AE60', '#52BE80', '#7DCEA0', '#A9DFBF', '#D4EFDF',
      '#7d6608', '#9a7d0a', '#b7950b', '#d4ac0d', '#f1c40f', '#f4d03f', '#f7dc6f', '#f9e79f', '#fcf3cf',
      '#784212', '#935116', '#af601a', '#ca6f1e', '#e67e22', '#eb984e', '#f0b27a', '#f5cba7', '#fae5d3',
      '#7b7d7d', '#979a9a', '#b3b6b7', '#d0d3d4', '#f0f3f4', '#f4f6f7', '#f7f9f9', '#fbfcfc', 'REMOVE'

    ],
    colorsStep: 9,
    colorsText: [
      '#641E16', '#7B241C', '#922B21', '#A93226', '#C0392B', '#CD6155', '#D98880', '#E6B0AA', '#F2D7D5',
      '#633974', '#76448A', '#884EA0', '#9B59B6', '#AF7AC5', '#C39BD3', '#D7BDE2', '#F4ECF7', '#F5EEF8',
      '#154360', '#1A5276', '#1F618D', '#2471A3', '#2980B9', '#5499C7', '#7FB3D5', '#A9CCE3', '#D4E6F1',
      '#0E6251', '#148F77', '#138D75', '#16A085', '#45B39D', '#73C6B6', '#76D7C4', '#A3E4D7', '#D1F2EB',
      '#145A32', '#196F3D', '#1E8449', '#229954', '#27AE60', '#52BE80', '#7DCEA0', '#A9DFBF', '#D4EFDF',
      '#7d6608', '#9a7d0a', '#b7950b', '#d4ac0d', '#f1c40f', '#f4d03f', '#f7dc6f', '#f9e79f', '#fcf3cf',
      '#784212', '#935116', '#af601a', '#ca6f1e', '#e67e22', '#eb984e', '#f0b27a', '#f5cba7', '#fae5d3',
      '#7b7d7d', '#979a9a', '#b3b6b7', '#d0d3d4', '#f0f3f4', '#f4f6f7', '#f7f9f9', '#fbfcfc', 'REMOVE'
    ],
    tableColorsStep: 9,
    tableColors: [
      '#641E16', '#7B241C', '#922B21', '#A93226', '#C0392B', '#CD6155', '#D98880', '#E6B0AA', '#F2D7D5',
      '#633974', '#76448A', '#884EA0', '#9B59B6', '#AF7AC5', '#C39BD3', '#D7BDE2', '#F4ECF7', '#F5EEF8',
      '#154360', '#1A5276', '#1F618D', '#2471A3', '#2980B9', '#5499C7', '#7FB3D5', '#A9CCE3', '#D4E6F1',
      '#0E6251', '#148F77', '#138D75', '#16A085', '#45B39D', '#73C6B6', '#76D7C4', '#A3E4D7', '#D1F2EB',
      '#145A32', '#196F3D', '#1E8449', '#229954', '#27AE60', '#52BE80', '#7DCEA0', '#A9DFBF', '#D4EFDF',
      '#7d6608', '#9a7d0a', '#b7950b', '#d4ac0d', '#f1c40f', '#f4d03f', '#f7dc6f', '#f9e79f', '#fcf3cf',
      '#784212', '#935116', '#af601a', '#ca6f1e', '#e67e22', '#eb984e', '#f0b27a', '#f5cba7', '#fae5d3',
      '#7b7d7d', '#979a9a', '#b3b6b7', '#d0d3d4', '#f0f3f4', '#f4f6f7', '#f7f9f9', '#fbfcfc', 'REMOVE'
    ],
    // tableDefaultWidth: "600px",
    tableStyles: {
      tableCenter: "Table Center",
    },
    linkStyles: {
      // whiteclr: "<span>White</span>",
      // silverclr: "<span>Silver</span>",
      // grayclr : `<span>Gray</span>`,
      // blackclr : `<span>Black</span>`,
      redclr: `<span style="color:#FF0000">Red</span>`,
      maroonclr: `<span style="color:#800000">Maroon</span>`,
      yellowclr: `<span style="color:#FFFF00">Yellow</span>`,
      oliveclr: `<span style="color:#808000">Olive</span>`,
      // limeclr : `<span style="color:#00FF00">Lime</span>`,
      greenclr: `<span style="color:#008000">Green</span>`,
      aquaclr: `<span style="color:#00FFFF">Aqua</span>`,
      tealclr: `<span style="color:#008080">Teal</span>`,
      // blueclr : `<span style="color:#0000FF">Blue</span>`,
      navyclr: `<span style="color:#000080">Navy</span>`,
      fuchsiaclr: `<span style="color:#FF00FF">Fuchsia</span>`,
      purpleclr: `<span style="color:#800080">Purple</span>`,
    },
    imageMove: false, // for remove css class 'fr-draggable'
    imageDefaultAlign: null,   // for remove css class 'fr-fir fr-dib'
    imageDefaultDisplay: null,  // for remove css class 'fr-fir fr-dib'
    imageDefaultWidth: 0,
    imageUploadParam: "image",
    imageStyles: {
      responsiveImg: 'Responsive Image',
    },

    // Set the image upload URL.
    imageUploadURL: `http://13.65.196.122:8085/api/Website/pagetempimages`,

    // Additional upload params.
    imageUploadParams: { returnasjson: true },

    // Set request type.
    imageUploadMethod: "POST",

    // Set max image size to 15MB.
    imageMaxSize: 15 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    events: {
      "image.beforeUpload": function (images) {
      },
      "image.uploaded": function (response) {
        this.src = response;
      },
      "image.inserted": function ($img, response) {
      },
      "image.replaced": function ($img, response) {
      },
      "image.error": function (error, response) {
      },
    },
    imageManagerLoadMethod: 'GET',
    imageManagerLoadURL: 'http://13.65.196.122:8085/api/ImageLibrary/images',
  },
  froalaEditorAppKey:
    "iTB2xC2C4D4A1A1B1wd1DBKSPF1WKTUCQOa1OURPJ1KDe2F-11D2C2D2H2C3A3B2D6C1C2==",
  clientWesiteUrl: ".funnelitnow.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
