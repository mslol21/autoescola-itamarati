const https = require('https');
const fs = require('fs');
const path = require('path');

const url1 = 'https://scontent-gru1-1.cdninstagram.com/v/t15.5256-10/825015566_1587390479793527_7724484853279936451_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=3i3Rf-vEi2oQ7kNvwEsRRqJ&_nc_oc=Adp7sxPsk6qSnP246H8JkG5qLd3G94fSXj5CLNZI1X1ynwenuJs23KL1KfJEFSPaCs4&_nc_zt=23&_nc_ht=scontent-gru1-1.cdninstagram.com&_nc_gid=V69g8BBl3LhiKDt3jRU1bw&_nc_ss=79aaf&oh=00_AQNXq2TZZkhFMd8i8kCLxagajgBttOBUYX9DHXT4e6DrKQ&oe=6ACB0DC8';

const url2 = 'https://scontent-gru2-1.cdninstagram.com/v/t51.71878-15/807868406_1447703230641685_1190942505440835721_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=ZRmjHTy3WcEQ7kNvwG4u7Ae&_nc_oc=Adqdy5Y52WlCDKe3lcOXAmkYErFok7kOiuW6icB7vIMEnD9e7Wbx03uPPOeEoSsyABU&_nc_zt=23&_nc_ht=scontent-gru2-1.cdninstagram.com&_nc_gid=lSSX53GTfsNmmpqFY6O0Cw&_nc_ss=79aaf&oh=00_AQMl46aaZGANr3vILhiiGZ7ol4PCW7omb0Jmx_hXSeJo7w&oe=6ACAFBE2';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ success: false, status: res.statusCode });
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ success: true, path: dest, size: fs.statSync(dest).size });
      });
    }).on('error', (err) => resolve({ success: false, error: err.message }));
  });
}

async function run() {
  const res1 = await downloadFile(url1, path.join(__dirname, '../public/images/gallery/instagram-reel-motoboy.jpg'));
  console.log('Download 1 (Motoboy/Motogirl):', res1);
  const res2 = await downloadFile(url2, path.join(__dirname, '../public/images/gallery/instagram-reel-guaianases.jpg'));
  console.log('Download 2 (Guaianases Autoescola):', res2);

  // Also duplicate to news directory so they can be used in news and gallery
  if (res1.success) {
    fs.copyFileSync(
      path.join(__dirname, '../public/images/gallery/instagram-reel-motoboy.jpg'),
      path.join(__dirname, '../public/images/news/instagram-reel-motoboy.jpg')
    );
  }
  if (res2.success) {
    fs.copyFileSync(
      path.join(__dirname, '../public/images/gallery/instagram-reel-guaianases.jpg'),
      path.join(__dirname, '../public/images/news/instagram-reel-guaianases.jpg')
    );
  }
}

run();
