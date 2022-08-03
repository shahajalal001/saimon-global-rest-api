import Package from '../models/package.model'
import { Request, Response } from "express"
import { getValue, setValue, removeAll } from '../utils/redisHelper'

export const createPackage = async (req: Request, res: Response) => {
    try {
        let {packageInput} = req.body
        let tempPackage = new Package(packageInput)
        let newPackage = await tempPackage.save()
        if(newPackage){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Package added successfully'
            })
        }
        return res.status(500).send({
            error: false,
            msg: 'Failed to add package'
        })
        
    } catch (e) {
        if (e?.code === 11000 && e?.keyPattern?.title) {
            return res.status(406).send({
                error: true,
                msg: 'Package title is unique',
            })
        }
        if (e?.code === 11000 && e?.keyPattern?.cityName) {
            return res.status(406).send({
                error: true,
                msg: 'One package is already availabe in this city',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const searchAllPackages = async (req: Request, res: Response) => {
    try {
        let packages = []
        let {searchPackageInput} = req.body
        const checkFromRedis = await getValue(JSON.stringify(searchPackageInput))
        if(checkFromRedis){
            packages = JSON.parse(checkFromRedis)
        }else{
            packages = await Package.find(searchPackageInput)
            await setValue(JSON.stringify(searchPackageInput), JSON.stringify(packages))
        }
        return res.status(200).send({
            error: false,
            msg: 'Package get successfully',
            data: packages
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const updatePackage = async (req: Request, res: Response) => {
    try {

        let {_id, packageInput} = req.body
        let updatePackage = await Package.updateOne({_id},packageInput)
        if(updatePackage.modifiedCount > 0){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Package updated successfully'
            })
        }
        return res.status(500).send({
            error: false,
            msg: 'Failed to update package'
        })
    } catch (e) {
        if (e?.code === 11000 && e?.keyPattern?.title) {
            return res.status(406).send({
                error: true,
                msg: 'Package title is unique',
            })
        }
        if (e?.code === 11000 && e?.keyPattern?.cityName) {
            return res.status(406).send({
                error: true,
                msg: 'One package is already availabe in this city',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deletePackage = async (req: Request, res: Response) => {
    try {
        let updatePackage = await Package.deleteOne({_id: req.params.id})
        if(updatePackage.deletedCount > 0){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Package deleted successfully',
            })
        }
        return res.status(500).send({
            error: false,
            msg: 'Package delete failed'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}