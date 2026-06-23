import Analysis from "../models/Analysis.js";
import { analyzeSeoData } from "../services/geminiService.js";
import { scrapeUrl } from "../services/scraperService.js";


//analyze a url
export const analyzeUrl = async (req,res) => {
    try{
        const {url} = req.body;
        if(!url) return res.status(400).json({success: false, message: "URL is required"});
        // Validate URL format
        let validUrl;
        try{
            validUrl = newURL(url.startsWith("http") ? url : `https:/${url}`);

        } catch (error) {
            return res.status(400).json({success: false, message: "Invalid URL format"});

        }
        // Create analysis record with pending status
        const analysis = await Analysis.create({userID: req.userId, url: validUrl.href,
            status: "processing"
        });

        //Send immediate response with analysis ID
        res.json({
            success: true, message: "Analysis started",  analysisId: analysis._id
        })
         // Run scraping and analysis in background
         try {
            // step 1 : scrape the url with browserbase
            const scrapeResult = await scrapeUrl(validUrl.href)
            if(!scrapeResult.success){
                analysis.status = "failed";
                await analysis.save();
                return;
            }
            // step 2 : analyze with gemini ai
            const aiResult = await analyzeSeoData(scrapeResult.data)

            if(!aiResult.success){
                analysis.status = "failed"
                await analysis.save()
                return;
            }
            // step 3: save results
            analysis.overallScore = aiResult.data.overallScore || 0;
            analysis.categories = aiResult.data.categories || {};
            analysis.metaData = scrapeResult.data.metaData || {};
            analysis.headings = scrapeResult.data.headings || {};
                analysis.links = scrapeResult.data.links || {};
                analysis.images = scrapeResult.data.images || {};
                analysis.keywords = aiResult.data.loadTime || 0;
                analysis.pageSize = scrapeResult.data.pageSize || 0;
                analysis.wordCount = scrapeResult.data.wordCount || 0;
                analysis.status = "completed";

                await analysis.save();
            }
         } catch (bgerror) {
            console.error("Background analysis error:", bgerror.message);
            try {
                analysis.status = "failed";
                await analysis.save()
            } catch (error) {
                
            } console.error("Failed to save failed status:", saveError.message);
         }
        
    } catch (error) {
        console.log("Analyze URL error:", error.message);
        if(!res.headersSent) {
            res.status(500).json({success: false, message: "Server error"})
        }
    }
}

//get analysis by ID
export const getAnalysis = async (req,res) => {

}

//get all analyses for user
export const getAnalyses = async (req, res) => {

}

// Delete analysis
export const deleteAnalysis = async (req,res) => {

}