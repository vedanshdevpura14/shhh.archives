export type Photo = {
  id: number;
  src: string;
  thumb: string;
  title: string;
  category: Category;
  location: string;
  year: string;
  width: number;
  height: number;
};

export type Category = "All";

export const categories: Category[] = ["All"];

// Personal photography archive — frames collected in passing.
// Replace titles / locations / years with your own metadata as you wish.
export const photos: Photo[] = [
  {
    id: 1,
    src: "/photos/full/photo-01.jpg",
    thumb: "/photos/thumb/photo-01.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // a/_DSC3246.jpg
  {
    id: 2,
    src: "/photos/full/photo-02.jpg",
    thumb: "/photos/thumb/photo-02.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // a/_DSC4152.jpg
  {
    id: 3,
    src: "/photos/full/photo-03.jpg",
    thumb: "/photos/thumb/photo-03.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // a/_DSC4382.jpg
  {
    id: 4,
    src: "/photos/full/photo-04.jpg",
    thumb: "/photos/thumb/photo-04.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // a/CLG_2268.jpg
  {
    id: 5,
    src: "/photos/full/photo-05.jpg",
    thumb: "/photos/thumb/photo-05.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // a/DSC_0346.jpg
  {
    id: 6,
    src: "/photos/full/photo-06.jpg",
    thumb: "/photos/thumb/photo-06.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // a/FF_03191-Enhanced-NR.jpg
  {
    id: 9,
    src: "/photos/full/photo-09.jpg",
    thumb: "/photos/thumb/photo-09.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // a/IMG_0403.JPG
  {
    id: 10,
    src: "/photos/full/photo-10.jpg",
    thumb: "/photos/thumb/photo-10.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // a/IMG_1090.JPG
  {
    id: 11,
    src: "/photos/full/photo-11.jpg",
    thumb: "/photos/thumb/photo-11.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // a/IMG_1112.JPG
  {
    id: 12,
    src: "/photos/full/photo-12.jpg",
    thumb: "/photos/thumb/photo-12.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // a/IMG_1113.JPG
  {
    id: 14,
    src: "/photos/full/photo-14.jpg",
    thumb: "/photos/thumb/photo-14.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // a/IMG_2020.JPG
  {
    id: 17,
    src: "/photos/full/photo-17.jpg",
    thumb: "/photos/thumb/photo-17.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // b/IMG_2045.JPG
  {
    id: 18,
    src: "/photos/full/photo-18.jpg",
    thumb: "/photos/thumb/photo-18.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // b/IMG_2063.jpg
  {
    id: 19,
    src: "/photos/full/photo-19.jpg",
    thumb: "/photos/thumb/photo-19.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // b/IMG_2141.JPG
  {
    id: 20,
    src: "/photos/full/photo-20.jpg",
    thumb: "/photos/thumb/photo-20.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // b/IMG_2820.JPG
  {
    id: 21,
    src: "/photos/full/photo-21.jpg",
    thumb: "/photos/thumb/photo-21.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // b/IMG_2954.JPG
  {
    id: 22,
    src: "/photos/full/photo-22.jpg",
    thumb: "/photos/thumb/photo-22.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // b/IMG_3742.JPG
  {
    id: 23,
    src: "/photos/full/photo-23.jpg",
    thumb: "/photos/thumb/photo-23.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // b/IMG_3745.JPG
  {
    id: 24,
    src: "/photos/full/photo-24.jpg",
    thumb: "/photos/thumb/photo-24.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // c/IMG_5345.JPG
  {
    id: 25,
    src: "/photos/full/photo-25.jpg",
    thumb: "/photos/thumb/photo-25.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // c/IMG_8395.JPG
  {
    id: 26,
    src: "/photos/full/photo-26.jpg",
    thumb: "/photos/thumb/photo-26.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 4,
    height: 3,
  }, // c/IMG_8398.JPG
  {
    id: 27,
    src: "/photos/full/photo-27.jpg",
    thumb: "/photos/thumb/photo-27.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // c/IMG_8400.JPG
  {
    id: 28,
    src: "/photos/full/photo-28.jpg",
    thumb: "/photos/thumb/photo-28.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // d/IMG_3748.JPG
  {
    id: 30,
    src: "/photos/full/photo-30.jpg",
    thumb: "/photos/thumb/photo-30.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // d/IMG_3757.JPG
  {
    id: 31,
    src: "/photos/full/photo-31.jpg",
    thumb: "/photos/thumb/photo-31.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // d/IMG_4203.JPG
  {
    id: 32,
    src: "/photos/full/photo-32.jpg",
    thumb: "/photos/thumb/photo-32.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // d/IMG_6093.JPG
  {
    id: 33,
    src: "/photos/full/photo-33.jpg",
    thumb: "/photos/thumb/photo-33.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // e/IMG_6234.JPG
  {
    id: 34,
    src: "/photos/full/photo-34.jpg",
    thumb: "/photos/thumb/photo-34.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 9,
    height: 16,
  }, // e/IMG_6300.JPG
  {
    id: 35,
    src: "/photos/full/photo-35.jpg",
    thumb: "/photos/thumb/photo-35.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // e/IMG_6511.JPG
  {
    id: 36,
    src: "/photos/full/photo-36.jpg",
    thumb: "/photos/thumb/photo-36.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // e/IMG_7129.JPG
  {
    id: 38,
    src: "/photos/full/photo-38.jpg",
    thumb: "/photos/thumb/photo-38.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // e/IMG_7583.JPG
  {
    id: 39,
    src: "/photos/full/photo-39.jpg",
    thumb: "/photos/thumb/photo-39.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // e/IMG_8236.JPG
  {
    id: 40,
    src: "/photos/full/photo-40.jpg",
    thumb: "/photos/thumb/photo-40.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 1,
    height: 2,
  }, // e/IMG_8304.JPG
  {
    id: 41,
    src: "/photos/full/photo-41.jpg",
    thumb: "/photos/thumb/photo-41.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // f/IMG_4990.JPG
  {
    id: 42,
    src: "/photos/full/photo-42.jpg",
    thumb: "/photos/thumb/photo-42.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // f/IMG_8952.JPG
  {
    id: 43,
    src: "/photos/full/photo-43.jpg",
    thumb: "/photos/thumb/photo-43.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // f/IMG_9083.JPG
  {
    id: 44,
    src: "/photos/full/photo-44.jpg",
    thumb: "/photos/thumb/photo-44.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 4,
  }, // f/IMG_9679.JPG
  {
    id: 45,
    src: "/photos/full/photo-45.jpg",
    thumb: "/photos/thumb/photo-45.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_0284.jpg
  {
    id: 46,
    src: "/photos/full/photo-46.jpg",
    thumb: "/photos/thumb/photo-46.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_0358.jpg
  {
    id: 47,
    src: "/photos/full/photo-47.jpg",
    thumb: "/photos/thumb/photo-47.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_1962.jpg
  {
    id: 48,
    src: "/photos/full/photo-48.jpg",
    thumb: "/photos/thumb/photo-48.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_2024.jpg
  {
    id: 49,
    src: "/photos/full/photo-49.jpg",
    thumb: "/photos/thumb/photo-49.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_2026.jpg
  {
    id: 50,
    src: "/photos/full/photo-50.jpg",
    thumb: "/photos/thumb/photo-50.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 2,
    height: 3,
  }, // upload/IMG_3758.JPG
  {
    id: 51,
    src: "/photos/full/photo-51.jpg",
    thumb: "/photos/thumb/photo-51.jpg",
    title: "",
    category: "All",
    location: "",
    year: "",
    width: 3,
    height: 2,
  }, // upload/IMG_7541.jpg
];
