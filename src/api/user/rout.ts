export const GET = async()=> {
    return new Response(JSON.stringify({name: "ali"}),{
      status: 200,
    });
};