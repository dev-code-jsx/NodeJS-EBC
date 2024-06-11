import Service from "../service/service.model.js";
import User from "../user/user.model.js";

export const addService = async (req, res) => {
    const { nameService, description, price } = req.body;
    const admin = req.user.uid;

    const adminExists = await User.findById(admin);

    try {
        const service = new Service({ nameService, description, price, createdBy: adminExists._id });

        await service.save();

        res.status(201).json({ msg: 'Service created successfully', service });
    } catch (error) {
        res.status(500).json({ msg: 'Error creating service' });
    }
}

export const getServices = async (req, res) => {
    const services = await Service.find();

    res.status(200).json(services);
}