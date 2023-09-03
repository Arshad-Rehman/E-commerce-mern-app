import bcrypt from 'bcrypt';

export const hashPassword = async(password) =>{
    try{
        const saltRounds=10; // number of rounds to use for salting the hash
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        return hashedPassword
    }catch(error){
        console.log("Error hashing password", error);
    }
}
export const comparePassword = async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
}
