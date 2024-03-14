export default function() {
    return ({ collider, collidee }) => {
        console.log('collision between', collider, collidee);
    }
}