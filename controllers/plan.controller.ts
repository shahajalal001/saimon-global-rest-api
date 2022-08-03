import Package from '../models/package.model'
import { Request, Response } from "express"
import { removeAll } from '../utils/redisHelper'
import mongoose from 'mongoose'

export const addPlan = async (req: Request, res: Response) => {
    try {
        let {packageId, planInput} = req.body
        planInput._id = new mongoose.Types.ObjectId()
        let updatePackage = await Package.updateOne({_id: packageId},{
            $push: {
                plans: planInput
            }
        })
        if(updatePackage.modifiedCount > 0){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Plan added successfully'
            })
        }
        return res.status(500).send({
            error: false,
            msg: 'Plan add failed'
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deletePlan = async (req: Request, res: Response) => {
    try {
        let updatePackage = await Package.updateOne({_id: req.params.packageId},{
            $pull: {
                plans: {
                    _id: req.params.planId
                }
            }
        })
        if(updatePackage.modifiedCount > 0){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Plan deleted successfully'
            })
        }
        return res.status(500).send({
            error: false,
            msg: 'Plan deletion failed'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const updatePlan = async (req: Request, res: Response) => {
    try {
        let {packageId, planId, planInput} = req.body
        let updatePackage = await Package.updateOne({_id: packageId, plans: {
            $elemMatch: {
                _id: planId
            }
        }},{
            $set: {
                'plans.$.singlePerPax': planInput.singlePerPax,
                'plans.$.doublePerPax': planInput.doublePerPax,
                'plans.$.twinPerPax': planInput.twinPerPax,
                'plans.$.triplePerPax': planInput.triplePerPax,
                'plans.$.child7To12': planInput.child7To12,
                'plans.$.child3To6': planInput.child3To6,
                'plans.$.infant': planInput.infant
            }
        })
        if(updatePackage.modifiedCount > 0){
            await removeAll()
            return res.status(200).send({
                error: false,
                msg: 'Plan updated successfully'
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Plan update failed'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}