import Service from "../service/service.model";

export const addService = async (req, res) => {
    const { nameService, description, price } = req.body;

    try {
        const service = new Service({ nameService, description, price, createdBy: req.user._id });

        await service.save();

        res.status(201).json({ msg: 'Service created successfully', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating service' });
    }
}

export const getServices = async (req, res) => {
    const services = await Service.find();

    res.status(200).json(services);
}