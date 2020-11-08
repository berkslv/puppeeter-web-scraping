let puppeteer = require('puppeteer');
var nodemailer = require('nodemailer');

scrapePrice('https://www.google.com/search?client=opera&hs=Wzk&sxsrf=ALeKk00I7IW96h0D13mdL99WUos0Xhz5MA%3A1604829566135&ei=fsGnX_DmB4XosAeQpInwAQ&q=türk+hava+yolları+hisse&oq=türk+hava+yolları+hisse&gs_lcp=CgZwc3ktYWIQAzIICAAQyQMQywEyBQgAEMsBMgUIABDLATIFCAAQywEyBQgAEMsBMgUIABDLATIFCAAQywEyBQgAEMsBMgUIABDLATIFCAAQywE6BAgAEEc6CwguEMcBEK8BEMsBUMULWKYSYNcSaABwAngAgAGpAogBwAeSAQUwLjQuMZgBAKABAaoBB2d3cy13aXrIAQjAAQE&sclient=psy-ab&ved=0ahUKEwjwnduB2PLsAhUFNOwKHRBSAh4Q4dUDCAw&uact=5');

function main(srcTxt)
{
    
    let currentPrice = srcTxt;
    let myPrice = 9.62;
    let myAmount = 6800;

    const currentEarningPercent = calcEarningPercent(currentPrice,myPrice);
    const currentEarningAmount = calcEarningAmount(myAmount,currentEarningPercent);
    const currentEarningProfit = calcEarningProfit(currentEarningAmount,myAmount);

    sendMail(currentEarningPercent,parseInt(currentEarningAmount),parseInt(currentEarningProfit));
}

async function scrapePrice(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="knowledge-finance-wholepage__entity-summary"]/div/g-card-section/div/g-card-section/span[1]/span/span[1]');
  const txt = await (await el.getProperty('textContent')).jsonValue(); // return 9,71 but parseFloat need to period not comma
  browser.close();
  let stringTxt = JSON.stringify(txt).replace('"',"").replace('"',"").replace(",","."); // first change json to string type, this return "number.decimal" and some string methods
  console.log(stringTxt);
  
  main(parseFloat(stringTxt));
}

function calcEarningPercent(currentPrice,yourPrice){
    return ((currentPrice - yourPrice)/yourPrice)*100;
}
function calcEarningAmount(priceAmount,earningPercent){
    return (priceAmount*earningPercent)/100;
}
function calcEarningProfit(earningAmount,amount){
    return earningAmount + amount;
}

async function sendMail(Percent,Amount,Profit){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'berkslv.bot@gmail.com',
          pass: '<berslv.bot - password>'
        }
      });
      
      var mailOptions = {
        from: 'berkslv.bot@gmail.com',
        to: 'berkslv@gmail.com',
        subject: 'Earnings of the day',
        html: `
                Profit percent: <h3 style="display: inline; font-family: Arial, Helvetica, sans-serif;">${Percent} %</h3>
            <br>
            <hr>
                Profit: <h3 style="display: inline; font-family: Arial, Helvetica, sans-serif;">${Amount} &#8378;</h3>
            <br>
            <hr>
                Current amount: <h3 style="display: inline; font-family: Arial, Helvetica, sans-serif;">${Profit} &#8378;</h3>
        `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

