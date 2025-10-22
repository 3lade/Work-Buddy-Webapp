const User = require('../models/userModel');
const { generateToken } = require('../authUtils');

const addUser = async (req, res) => {
    try {
        await User.create(req.body);
        return res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
            let isMatch = false;

            if (typeof user.comparePassword === "function") {
                isMatch = await user.comparePassword(password);
            } else if (user.password !== undefined) {
                isMatch = user.password === password;
            }

            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            const token = generateToken(user._id, user.role);
            const response = {
                userName: user.userName,
                role: user.role,
                token: token,
                id: user._id
            };
            return res.status(200).json(response);
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;
        console.log(" search term:", search);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { userName: searchRegex },
                { email: searchRegex }
            ];
        }

        const employees = await User.find(query).sort({ userName: 1 }).skip(skip).limit(limit);
        console.log(employees);
        const totalEmployees = await User.countDocuments(query);
        const totalPages = Math.max(1, Math.ceil(totalEmployees / limit));

        return res.status(200).json({
            employees,
            pagination: {
                currentPage: page,
                totalPages,
                totalEmployees
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getUserByEmailAndPassword,
    addUser,
    getAllEmployees
};