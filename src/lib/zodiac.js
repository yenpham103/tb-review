export const zodiacAnimals = [
    'Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)',
    'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)',
    'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Heo)'
]

export function getRandomZodiac() {
    return zodiacAnimals[Math.floor(Math.random() * zodiacAnimals.length)]
}