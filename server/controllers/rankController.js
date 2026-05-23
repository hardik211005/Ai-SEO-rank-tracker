import KeywordTracking from "../models/keywordTracking.js";

//add a keyword to track
export const addKeyword = async (req, res) => {
try {
    const  {keyword, url} = req.body;
    if(!keyword || !url) return res.status(400).json({message: "Keyword and URL are required"});

    //extract domain from url
    let domain;
    try {
        const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`);
        domain = urlObj.hostname.replace('www.', '');
    } catch (error) {
        return res.status(400).json({message: "Invalid URL format"});
    }

    //check if already tracking this keyword+domain
    const existing = await KeywordTracking.findOne({userId: req.userId, keyword: keyword.toLowerCase().trim(), domain});
    if(existing){
        return res.status(400).json({success: false, message: "Already tracking this keyword for the given URL"});
    }
    //create tracking entry
    const tracking = await KeywordTracking.create({
        userId: req.userId,
        keyword: keyword.toLowerCase().trim(),
        url: url.startsWith("http") ? url : `http://${url}`,
        domain,
        status: "checking"
    })
    res.status(201).json({success: true,  message: "Keyword tracking started", tracking })
    
} catch (error) {
    
}
}

//get all tracked keywords
export const getKeywords = async (req, res) => {

}


//Get single keyword with full history
export const getKeyword = async (req, res) => {

}

//delete a tracked keyword
export const deleteKeyword = async (req, res) => {

}

//toggle tracking active/inactive
export const toggleTracking = async (req, res) => {

}