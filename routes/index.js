var express = require('express');
require('dotenv').config();
const {google} = require('googleapis');
const vDb = require('../models/videoModel')
var router = express.Router();

const db = new vDb();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
async function getViews({videoId}){
  const videoDetail = await google.youtube('v3').videos.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'statistics',
    id: videoId,
  });
  const videoViewCount = videoDetail.data['items'][0].statistics['viewCount'];
  return videoViewCount;

}
async function getSubscriber({channelId}){
  const channelDetail = await google.youtube('v3').channels.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'statistics',
    id: channelId,
  });
  const channelSubscribers = channelDetail.data['items'][0].statistics['subscriberCount'];
  return channelSubscribers;
}

router.get('/add', async function(req, res, next) {
  const baseUrl = 'https://www.youtube.com/watch?v=';
  let url = req.query['url'];
  let category = req.query['category'];
  let temp = url.split('=');
  const index = parseInt(temp.length);
  if(req.query['checkBox'] == "on"){
    var channelId = temp[index - 1];
    console.log(process.env.YOUTUBE_TOKEN);
    console.log(channelId);
    const response = await google.youtube('v3').playlistItems.list({
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      playlistId: channelId,
      maxResults: 200,
    });
    let videos = [];
    const items = response.data['items'];
    console.log('Length>>> ', items.length);
    for (var i = 0; i < items.length; i++) {
      const snippets = items[i].snippet;
      const videoTitle = items[i].snippet['title'];
      const videoThumbnail = items[i].snippet['thumbnails'].high['url'];
      const channelName = items[i].snippet['channelTitle'];
      const videoLink = (baseUrl+snippets.resourceId['videoId']);
      const channelId = items[i].snippet['channelId'];
      const channelDetail = await google.youtube('v3').channels.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        id: channelId,
      });
      var videoViewCount, subscribers;
      await getViews({videoId: snippets.resourceId['videoId']}).then(function (data) {
        videoViewCount = data;
      });
      await getSubscriber({channelId: channelId}).then(function (data) {
        subscribers = data;
      });
     const channelThumbnail = channelDetail.data['items'][0].snippet['thumbnails'].high['url'];
      // res.send(channelDetail);
      console.log('-----------------Start-',i,'------------------');
      console.log('Video LINK>>>>>>>',videoLink);
      console.log('Video Views>>>>>>', videoViewCount);
      console.log('Video TITLE>>>>>>>',videoTitle);
      console.log('Video Thumbnail>>>>>',videoThumbnail);
      console.log('Channel Name>>>>',channelName);
      console.log('Channel Thumbnail>>>', channelThumbnail);
      console.log('Channel Subscribers>>>',subscribers);
      console.log('Channel ID>>>>>>', channelId);
      console.log('------------------',i,'-----------------END-');
      // let videoUrl = baseUrl+snippets.resourceId['videoId'];
      const video = new db.videos({
        category:category,
        videoLink:videoLink,
        videoViewCount:videoViewCount,
        videoTitle:videoTitle,
        videoThumbnail:videoThumbnail,
        channelName:channelName,
        channelThumbnail:channelThumbnail,
        subscribers:subscribers,
      });
      videos[i] = video;
    }
    await db.addManyVideos({videos: videos});
    res.send(videos);
  }else{
    console.log('ELSE PART');
    await db.addVideo({category: category, subCategory: subCategory, videoUrl: url});
    res.send(req.body)
  }
});
router.get('/getsubcategory', async function(req, res, next) {
  const category = req.query['category'];
  const subcategory = await db.getSubCategory({category: category});
  res.send(subcategory);
});
router.get('/getvideos', async function(req, res, next) {
  const category=req.query['category'];
  const videosUrl = await db.getVidoes({category: category});
  console.log(videosUrl);
  res.send(videosUrl);
});


module.exports = router;
