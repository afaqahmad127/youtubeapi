const mongoose = require('mongoose');


const videoDb = class Video {

    constructor() {
        //Structure or Schema of document
        this.videoSchema = new mongoose.Schema({
            category: {
                type: String,
                required: true,
            },
            videoLink:{
                type: String,
                required: true,
            },
            videoViewCount:{
                type: String,
                required: true,
            },
            videoTitle:{
                type: String,
                required: true,
            },
            videoThumbnail:{
                type: String,
                required: true,
            },
            channelName:{
                type: String,
                required: true,
            },
            channelThumbnail:{
                type: String,
                required: true,
            },
            subscribers:{
                type: String,
                required: true,
            },
        });
        //this will enable us to paged or for searching
        this.videoSchema.index({'$**': 'text'});
        //Create collection in mongodb
        this.videos = new mongoose.model('VideoLinks', this.videoSchema);
    }

    async addVideo({ category, videoUrl }) {
        try {
            const video = new this.videos({
                category: category,
                videoUrl: videoUrl,
            });
            await video.save();
        }
        catch (err) {
            console.log('Error while Adding Videos');
        }
    }
    async addManyVideos({ videos }) {
        try {
            await this.videos.insertMany(videos);
        }
        catch (err) {
            console.log('Error while Adding Many Videos');
        }
    }
    async getSubCategory({ category }) {
        try {
            const subCategories = this.videos.distinct("subCategory", {category: category});
            return subCategories;

        }
        catch (err) {
            console.log('Error while Getting Sub Categories');
        }
    }
    async getVidoes({ category }) {
        try {
            // const videoUrls = this.videos.find({category:category});
            const videoUrls = this.videos.aggregate(
                [
                    { $match: {category:category} },
                    { $sample: { size: 40 } }
                ]
            );
            // console.log(videoUrls);
            return videoUrls;


        }
        catch (err) {
            console.log('Error while Getting Video Urls');
        }
    }
    async getSortedVidoes() {
        try {
            const videoUrls = this.videos.find().sort({videoViewCount: 1});
            // console.log(videoUrls);
            return videoUrls;


        }
        catch (err) {
            console.log('Error while Getting Video Urls');
        }
    }
    async getSearchVidoes({ search }) {
        try {
            const videoUrls = this.videos.find({
                $or: [
                    {videoTitle: RegExp(search, "i")},
                    {channelName: RegExp(search, "i")}
                ],
            });
            // console.log(videoUrls);
            return videoUrls;


        }
        catch (err) {
            console.log('Error while Getting Video Urls');
        }
    }
}
module.exports = videoDb;