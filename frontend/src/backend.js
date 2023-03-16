export default async function getUserProfile(params) {
    console.log(params);
    return { userId: params.userId }
};