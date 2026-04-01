/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '575px',
        // => @media (min-width: 575px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      colors:{
        'primary':'#ba7a0c',
        'secondary':'#0F172A',
        'dark':'#1C1917',
        'd1':'#CBD5E1',
        'd2':'#F3F4F6',
        'd3':'#CCE0BD',
        'd4':'#492d22',
        'd5':'#94A3B8',
        'l1':'#CBD5E1',
        'l2':'#F0F0F0',
        'l3':'#F3F4F6',
        'ratting':'#FFB800',
        'red_1': '#DA5D5E'
      },
      fontSize:{
        '14':['14px','20px'],
        '16':['16px','24px'],
        '18':['18px','26px'],
        '20':['20px','28px'],
        '22':['22px','30px'],
        '24':['24px','32px'],
        '26':['26px','34px'],
        '36':['36px','44px'],
        '40':['40px','52px'],
        '44':['44px','60px'],
        '48':['48px','64px'],
        '56':['56px','72px'],
        '64':['64px','74px'],
      },
      boxShadow:{
        'one':'17px 17px 200px 0px #40454F1F',
        'two':'0px 2px 6px 0px #ebebeb',
        'three':'0px 14px 40px 0px rgba(0,0,0,0.1)',
        'four':'0px 20px 50px 0px rgba(18, 17, 39, 0.08)'
      }
    },
  },
  plugins: [],
}
