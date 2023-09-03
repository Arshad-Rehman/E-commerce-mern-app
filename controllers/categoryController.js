import categoryModal from "../models/categoryModal.js";
import slugify from "slugify";
export const createCategoryController = async (req,resp)=>{
try{
const{name} = req.body;
if(!name){
    return resp.status(401).send({
        message: 'Name is required'
    })
}
const existingCategory = await categoryModal.findOne({name});
if(existingCategory){
    return resp.status(200).send({
        success: true,
        message: 'Category Already Exists'
    })
}
const category = await new categoryModal({name,slug: slugify(name)}).save()
resp.status(201).send({
    success: true,
    message:'new catgory created',
    category
})
}catch(error){
    console.log(error)
    resp.status(500).send({
        success:false,
        error,
        message:'Error in Category'
    })
}
}
export const updateCategoryController= async(req,resp)=>{
try{
    const {name} = req.body;
    const {id} = req.params
const catgory = await categoryModal.findByIdAndUpdate(id,{name,slug: slugify(name)},
{new: true}
);
resp.status(200).send({
    success:true,
    message:"Category Upadated Succesfully",
    catgory
})
}catch(error){
console.log(error);
resp.status(500).send({
    success: false,
    message: 'Error while updating category',
    error
})
}
}
export const categoryController=async(req,resp)=>{
try{
const category = await categoryModal.find({});
resp.status(200).send({
    success: true,
    message:"All Category",
    category
})
}catch(error){
    console.log(error);
    resp.status(500).send({
        success: false,
        message: "Internal Server Error",
        error
    })
}
}

export const singleCategoryController =async(req,resp)=>{
try{
const singleCategory = await categoryModal.findOne({slug:req.params.slug});
resp.status(200).send({
    success:true,
    message:'Single Category Found Successfully.',
    singleCategory
})
}
catch(error){
    console.log(error)
    resp.status(500).send({
        success:false,
        message:"Internal Server Error",
        error
    })
}
}
export const deletecategoryCotroller= async (req,resp)=>{
try{
    const {id} = req.params
await categoryModal.findByIdAndDelete(id);
resp.status(200).send({
    success:true,
    message:'Category Deleted Successfully',

})
}catch(error){
    console.log(error)
    resp.status(500).send({
        success:false,
        message:"Error while deleting",
        error,
    }) 
}
}