var webdriver = require('selenium-webdriver');
var assert = require('assert');
var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
var baseurl= "https://www.sbs.com.au/language/english/audio/sbs-hindi-news-13-july-2021-more-financial-support-amid-extended-nsw-lockdown";
var expectedTitle = "SBS Language | SBS Hindi News 13 July 2021: More financial support amid extended NSW lockdown";
var until = webdriver.until;
var By = webdriver.By;

async function startbrowser() { 
 await driver.manage().window().maximize();
    await driver.get(baseurl);
    driver.getTitle().then(function (title) {
        console.log(title)
        assert.strictEqual(title, expectedTitle, "Title assertion failed");
        console.log('----------------Title verification completed successfully----------------');
    });
    //Verify clicking on language toggle
    await driver.findElement(By.xpath('//a[@data-type="toggle-language"]')).click();
    var langauge = await driver.findElement({ css: 'div.language-toggle__body > ul > li > div' }).getText();
    console.log(langauge);
    assert.strictEqual('English', langauge, "Title assertion failed");
    //Verify Subscribe dropdown
    await driver.wait(until.elementLocated(By.className("podcast-subscribe__label dropdown__button label")), 5000);
    await driver.findElement(By.className("podcast-subscribe__label dropdown__button label")).click();

    await new Promise(r => setTimeout(r, 5000));
    const optionArray = [];

        let links = await driver.findElements({ css: 'div > ul.podcast-subscribe__list >li' });
    for (let link of links) {
        text = await link.getText();
        //console.log(text);
        optionArray.push(text)
    }
    assert.strictEqual('APPLE PODCASTS', optionArray[0], "Subscribe dropdown displays apple pod casts assertion failed");
    assert.strictEqual('GOOGLE PODCASTS', optionArray[1], "Subscribe dropdown displays google pod casts assertion failed");
    console.log('----------------Subscribe Dropdown verification completed successfully----------------');

   //3. click on play button and validate player is running
    await driver.findElement(By.xpath('//span[@class="audiotrack__icon audiotrack__icon--play-pause"]')).click();
    await driver.sleep(2 * 2000)
    const Nowplaying = await driver.findElement(By.id('mod-audio-player_module-1')).isEnabled();
    console.log(Nowplaying);
    console.log('----------------Audio Player verification completed successfully----------------');

    //4. Click and verify player controls – Play and pause, mute and unmute
    //Pause
    await driver.findElement(By.xpath('//div[@class="audio-player__loader loader loader--relative"]//button')).click();
    //Play
    await driver.sleep(5 * 2000)
    await driver.findElement(By.xpath('//div[@class="audio-player__loader loader loader--relative"]//button')).click();
    //Mute 
    await driver.sleep(5 * 2000)
    await driver.findElement(By.xpath('//button[@aria-label="Mute"]')).click();
    //Unmute
    await driver.sleep(5 * 2000)
    await driver.findElement(By.xpath('//button[@aria-label="Mute"]')).click();
    console.log('---------------- player controls validation completed successfully----------------');
    //Click 20s forward or rewind
    //Pause
    await driver.sleep(5 * 2000)
    await driver.findElement(By.xpath('//div[@class="audio-player__loader loader loader--relative"]//button')).click();
    //Fetch time of elapsed
    await driver.sleep(5 * 2000)
    const Bef_Elapsed_time = await driver.findElement(By.xpath('//span[@aria-label="Elapsed Time"]')).getText();
    var BTS = Bef_Elapsed_time.split(':');
    var B_seconds = ((+BTS[0]) * 60 + (+BTS[1]));
    B_seconds20 = B_seconds + 20;
    console.log(B_seconds20);
    //click 20 secs fwd
    await driver.findElement(By.xpath('//button[@aria-label="Step forward 20 seconds"]')).click();
    //Fetch time of elapsed
    await driver.sleep(5 * 2000)
    const Aft_Elapsed_time = await driver.findElement(By.xpath('//span[@aria-label="Elapsed Time"]')).getText();
    var ATS = Aft_Elapsed_time.split(':');
    var A_seconds = ((+ATS[0]) * 60 + (+ATS[1]));
    console.log(A_seconds);
    assert.strictEqual(A_seconds, B_seconds20, "Fwd 20 seconds validation failed");
    console.log('---------------- Fwd 20-seconds Verification completed successfully----------------');
    //Reverse 20 sec button validation 
    await driver.findElement(By.xpath('//button[@aria-label="Step back 20 seconds"]')).click();
    await driver.sleep(5 * 2000)
    const Aft_Elapsed_time2 = await driver.findElement(By.xpath('//span[@aria-label="Elapsed Time"]')).getText();
    var ATS2 = Aft_Elapsed_time2.split(':');
    var A_seconds2 = ((+ATS2[0]) * 60 + (+ATS2[1]));
    console.log(B_seconds);
    console.log(A_seconds2);
    assert.strictEqual(B_seconds, A_seconds2, "Fwd 20 seconds validation failed");
    console.log('---------------- Rwd 20-seconds Verification completed successfully----------------');
    await driver.quit();
    console.log('I will execute after driver.quit');
}
startbrowser();