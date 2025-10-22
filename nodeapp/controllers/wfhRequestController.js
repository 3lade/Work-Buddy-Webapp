const WfhRequest = require('../models/wfhRequestModel');

const getAllWfhRequests = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const statusFilter = req.query.status;
        const sortBy = req.query.sort;

        // Build base query object
        const query = {};

        // Search by reason
        if (searchTerm && searchTerm.trim() !== '') {
            query.reason = { $regex: searchTerm, $options: 'i' };
        }

        // Filter by status
        if (statusFilter && statusFilter.trim() !== '') {
            query.status = statusFilter;
        }

        let order;
        if (sortBy) {
            order = sortBy === 'asc' ? 1 : -1;
        }

    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 5;
    const skip = (pageNum - 1) * limitNum;

        let queryResult = WfhRequest.find(query)
            .populate("userId", "userName email role");

        if (order !== undefined) {
            queryResult = queryResult.sort({ startDate: order });
        }

        const allWfhRequests = await queryResult.skip(skip).limit(limitNum);

        const totalCount = await WfhRequest.countDocuments(query);
        
        res.status(200).json({
            allWfhRequests,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum) || 0,
            totalItems: totalCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getWfhRequestById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = WfhRequest.findById(id);
        
        const foundRequest = query.populate 
            ? await query.populate('userId', 'userName email role')
            : await query;
            
        if (foundRequest) {
            res.status(200).json(foundRequest);
            return;
        }
        res.status(404).json('Request not found')
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const addWfhRequest = async (req, res) => {
    try {
        const newRequest = await WfhRequest.create(req.body);
        res.status(200).json(newRequest);
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateWfhRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedRequest = await WfhRequest.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedRequest) {
            res.status(404).json('Request not found');
            return;
        }
        res.status(200).json(updatedRequest);
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getWfhRequestsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const searchTerm = req.query.search;
        const statusFilter = req.query.status;
        const page = req.query.page;
        const limit = req.query.limit;
        
        // Build query
        const query = { userId };
        
        // Search by reason
        if (searchTerm) {
            query.reason = { $regex: searchTerm, $options: 'i' };
        }
        
        // Filter by status
        if (statusFilter) {
            query.status = statusFilter;
        }
        
        // Apply pagination (always use pagination now)
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 5;
        const skip = (pageNum - 1) * limitNum;
        
        const foundRequests = await WfhRequest.find(query)
            .sort({ createdOn: -1 })
            .skip(skip)
            .limit(limitNum);
            
        const totalCount = await WfhRequest.countDocuments(query);
        
        // Return empty array instead of 404
        res.status(200).json({
            wfhRequests: foundRequests,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum) || 0,
            totalItems: totalCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteWfhRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteRequest = await WfhRequest.findByIdAndDelete(id);

        if (!deleteRequest) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json({ message: 'Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllWfhRequests,
    getWfhRequestById,
    addWfhRequest,
    updateWfhRequest,
    getWfhRequestsByUserId,
    deleteWfhRequest
};