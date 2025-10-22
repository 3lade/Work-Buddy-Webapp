const LeaveRequest = require('../models/leaveRequestModel');

const getAllLeaveRequests = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const statusFilter = req.query.status;
        const sortBy = req.query.sort;
        const page = req.query.page;
        const limit = req.query.limit;
        
    
        if (!page && !limit && !searchTerm && !statusFilter && !sortBy) {
            const allData = await LeaveRequest.find({})
                .populate('userId', 'userName email role')
                .sort({ createdOn: -1 });
            return res.status(200).json(allData);
        }
        
        
        const query = {};
     
        // Search by reason
        if (searchTerm) {
            query.reason = { $regex: searchTerm, $options: 'i' };
        }
        
        // Filter by status
        if (statusFilter) {
            query.status = statusFilter;
        }
       
        let order;
        if (sortBy) {
            order = sortBy === 'asc' ? 1 : -1;
        }
       
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        
        let queryResult = LeaveRequest.find(query).populate('userId', 'userName email role');
        
        if (order !== undefined) {
            queryResult = queryResult.sort({ startDate: order });
        }
        
        const allLeaveRequests = await queryResult.skip(skip).limit(limitNum);
        const totalCount = await LeaveRequest.countDocuments(query);
        
        res.status(200).json({
            allLeaveRequests,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLeaveRequestById = async (req, res) => {
    try {
        const id = req.params.id;
        const foundRequest = await LeaveRequest.findById(id);
        if (foundRequest) {
            res.status(200).json(foundRequest);
            return;
        }
        res.status(404).json('Request not found')

    } catch (error) {
        res.status(500).json(error.message)
    }
}

const addLeaveRequest = async (req, res) => {
    try {
        const newRequest = await LeaveRequest.create(req.body);
        res.status(200).json(newRequest);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateLeaveRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedRequest = await LeaveRequest.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedRequest) {
            res.status(404).json('Request not found');
            return;
        }
        res.status(200).json(updatedRequest);

    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getLeaveRequestsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const searchTerm = req.query.search;
        const statusFilter = req.query.status;
        const dateFilter = req.query.date;
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
        
        // Filter by start date
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            const nextDay = new Date(filterDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            query.startDate = {
                $gte: filterDate,
                $lt: nextDay
            };
        }
        
        // If no pagination params, return all matching data
        if (!page && !limit) {
            const foundRequests = await LeaveRequest.find(query).sort({ createdOn: -1 });
            // always return an array (possibly empty) instead of 404
            return res.status(200).json(foundRequests);
        }
        
        // Apply pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 5;
        const skip = (pageNum - 1) * limitNum;
        
        const foundRequests = await LeaveRequest.find(query)
            .sort({ createdOn: -1 })
            .skip(skip)
            .limit(limitNum);
            
        const totalCount = await LeaveRequest.countDocuments(query);
        
        // If no items found, return an empty list with pagination info
        res.status(200).json({
            leaveRequests: foundRequests,
            currentPage: pageNum,
            totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
        });
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteLeaveRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteRequest = await LeaveRequest.findByIdAndDelete(id);
        if (!deleteRequest) {
            res.status(404).json("Request not found");
            return;
        }
        res.status(200).json('Deleted Successfully')

    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = {
    getAllLeaveRequests,
    getLeaveRequestById,
    addLeaveRequest,
    updateLeaveRequest,
    getLeaveRequestsByUserId,
    deleteLeaveRequest
}