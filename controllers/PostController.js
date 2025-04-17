import Post from "../models/PostModels.js";

export const postData = async (req, res) => {
    try {
		const listData = await Post.create(req.body);
		return res.status(200).json({
			status: "success",
			data: listData,
		});
	} catch (error) {
		res.status(400).json({
			status: "failed",
			message: error.message,
		});
	}
    // try {
    //     const newPost = await Post.create(req.body);
    //     return res.status(201).json({
    //         status: "success",
    //         data: newPost});
    // } catch (error) {
    //     res.status(500).json({ status: "failed", message: error.message });
    // }   
}