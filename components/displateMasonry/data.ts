export interface Images {
  mobile: string
  mobileRetina: string
  desktop: string
  desktopRetina: string
}
interface Displate {
  id: number
  itemCollectionId: number
  collection: {
    id: number
    name: string
    url: string
  }
  title: string
  orientation: string
  exclusive: boolean
  url: string
  imageUrl: string
  images: Images
  author: {
    fullName: string
  }
  brand: {
    name: string
  } | null
}

const data: Displate[] = [
  {
    id: 4714131,
    itemCollectionId: 5619282,
    collection: {
      id: 424298,
      name: 'Duels of Fate',
      url: '/star_wars/duels-of-fate',
    },
    title: 'Mustafar',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5619282',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
    },
    author: {
      fullName: 'Star Wars  ',
    },
    brand: {
      name: 'Star Wars',
    },
  },
  {
    id: 3510407,
    itemCollectionId: 4327102,
    collection: {
      id: 359544,
      name: 'Mandalorian Season 2 Trailer Art',
      url: '/star_wars/mandalorian-season-2-trailer-art',
    },
    title: 'Mandalorian Season 2 Poster',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/4327102',
    imageUrl:
      'https://static.displate.com/280x392/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
    },
    author: {
      fullName: 'Star Wars  ',
    },
    brand: {
      name: 'Star Wars',
    },
  },
  {
    id: 1773086,
    itemCollectionId: 2372411,
    collection: {
      id: 238560,
      name: 'Vaatividya Originals',
      url: '/vaatividya/vaatividya-originals',
    },
    title: 'The Painted World',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/2372411',
    imageUrl:
      'https://static.displate.com/280x392/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
    },
    author: {
      fullName: 'VaatiVidya ',
    },
    brand: null,
  },
  {
    id: 5304548,
    itemCollectionId: 6223162,
    collection: {
      id: 452456,
      name: 'Lands Between',
      url: '/elden-ring/lands-between',
    },
    title: 'Godfrey',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/6223162',
    imageUrl:
      'https://static.displate.com/280x392/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
    },
    author: {
      fullName: 'ELDEN RING ',
    },
    brand: {
      name: 'ELDEN RING',
    },
  },
  {
    id: 532302,
    itemCollectionId: 982572,
    collection: {
      id: 149996,
      name: 'Wild Hunt Characters',
      url: '/witcher3/wild-hunt-characters',
    },
    title: 'Geralt Sword',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/982572',
    imageUrl:
      'https://static.displate.com/280x392/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
    },
    author: {
      fullName: 'Witcher 3 ',
    },
    brand: {
      name: 'Witcher 3',
    },
  },
  {
    id: 5007101,
    itemCollectionId: 5918640,
    collection: {
      id: 438541,
      name: "Sorcerer's Stone Movie Posters",
      url: '/wizarding-world/sorcerer-s-stone-movie-posters',
    },
    title: 'Hogwarts boats',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5918640',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
    },
    author: {
      fullName: 'Wizarding World ',
    },
    brand: {
      name: 'Wizarding World',
    },
  },
  {
    id: 5434966,
    itemCollectionId: 6356503,
    collection: {
      id: 458745,
      name: 'Tarot Cards',
      url: '/cyberpunk/tarot-cards',
    },
    title: 'Empress',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/6356503',
    imageUrl:
      'https://static.displate.com/280x392/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
    },
    author: {
      fullName: 'Cyberpunk 2077 ',
    },
    brand: {
      name: 'Cyberpunk 2077',
    },
  },
  {
    id: 5225254,
    itemCollectionId: 6142808,
    collection: {
      id: 446328,
      name: 'Middle-Earth Maps',
      url: '/middle-earth/middle-earth-maps',
    },
    title: 'Middle-Earth Map',
    orientation: 'horizontal',
    exclusive: false,
    url: '/displate/6142808',
    imageUrl:
      'https://static.displate.com/392x280/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
    images: {
      mobile:
        'https://static.displate.com/190x135/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      mobileRetina:
        'https://static.displate.com/380x270/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      desktop:
        'https://static.displate.com/227x162/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      desktopRetina:
        'https://static.displate.com/454x324/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
    },
    author: {
      fullName: 'Middle-Earth ',
    },
    brand: {
      name: 'Middle-Earth',
    },
  },
  {
    id: 562752,
    itemCollectionId: 1017301,
    collection: {
      id: 149976,
      name: 'Neutral Deck',
      url: '/gwent/neutral-deck',
    },
    title: 'Roach',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/1017301',
    imageUrl:
      'https://static.displate.com/280x392/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
    },
    author: {
      fullName: 'GWENT ',
    },
    brand: {
      name: 'Gwent',
    },
  },
  {
    id: 4442340,
    itemCollectionId: 5335218,
    collection: {
      id: 120555,
      name: 'Digital Art',
      url: '/ciucinciu/digital-art',
    },
    title: 'Judgmental Duck',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5335218',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
    },
    author: {
      fullName: 'Ciucinciu Tiberius',
    },
    brand: null,
  },
  {
    id: 4714131,
    itemCollectionId: 5619282,
    collection: {
      id: 424298,
      name: 'Duels of Fate',
      url: '/star_wars/duels-of-fate',
    },
    title: 'Mustafar',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5619282',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-11-24/6fe5f68a13cfe96c8eef8f96a45083a9_c96091ab7ed30498d1ae6e35f22b63a9.jpg',
    },
    author: {
      fullName: 'Star Wars  ',
    },
    brand: {
      name: 'Star Wars',
    },
  },
  {
    id: 3510407,
    itemCollectionId: 4327102,
    collection: {
      id: 359544,
      name: 'Mandalorian Season 2 Trailer Art',
      url: '/star_wars/mandalorian-season-2-trailer-art',
    },
    title: 'Mandalorian Season 2 Poster',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/4327102',
    imageUrl:
      'https://static.displate.com/280x392/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2021-01-25/186ed82707fb39980d0d58995b183d4a_8437f585981b9b9a73d388df16444e81.jpg',
    },
    author: {
      fullName: 'Star Wars  ',
    },
    brand: {
      name: 'Star Wars',
    },
  },
  {
    id: 1773086,
    itemCollectionId: 2372411,
    collection: {
      id: 238560,
      name: 'Vaatividya Originals',
      url: '/vaatividya/vaatividya-originals',
    },
    title: 'The Painted World',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/2372411',
    imageUrl:
      'https://static.displate.com/280x392/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2020-05-04/ae78b94f84ad71c14293561bfc90dc59_16ec557fe8d4fd65faa284109fb5cf19.jpg',
    },
    author: {
      fullName: 'VaatiVidya ',
    },
    brand: null,
  },
  {
    id: 5304548,
    itemCollectionId: 6223162,
    collection: {
      id: 452456,
      name: 'Lands Between',
      url: '/elden-ring/lands-between',
    },
    title: 'Godfrey',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/6223162',
    imageUrl:
      'https://static.displate.com/280x392/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2023-02-09/71049421c849d08851529ad62371e7a6_5dfcd9ee3c1b832f2e745ef734bdcf9b.jpg',
    },
    author: {
      fullName: 'ELDEN RING ',
    },
    brand: {
      name: 'ELDEN RING',
    },
  },
  {
    id: 532302,
    itemCollectionId: 982572,
    collection: {
      id: 149996,
      name: 'Wild Hunt Characters',
      url: '/witcher3/wild-hunt-characters',
    },
    title: 'Geralt Sword',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/982572',
    imageUrl:
      'https://static.displate.com/280x392/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2019-04-25/f1f11a1ea117d1257c670dd124547df1_df19dd10e9015250159f1ea7064edb1e.jpg',
    },
    author: {
      fullName: 'Witcher 3 ',
    },
    brand: {
      name: 'Witcher 3',
    },
  },
  {
    id: 5007101,
    itemCollectionId: 5918640,
    collection: {
      id: 438541,
      name: "Sorcerer's Stone Movie Posters",
      url: '/wizarding-world/sorcerer-s-stone-movie-posters',
    },
    title: 'Hogwarts boats',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5918640',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-11-02/ff1107b82b51aa2d2e056ac8fdd6a51b_69cee8bd2e2ffd7245f079cd9e7ea4d0.jpg',
    },
    author: {
      fullName: 'Wizarding World ',
    },
    brand: {
      name: 'Wizarding World',
    },
  },
  {
    id: 5434966,
    itemCollectionId: 6356503,
    collection: {
      id: 458745,
      name: 'Tarot Cards',
      url: '/cyberpunk/tarot-cards',
    },
    title: 'Empress',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/6356503',
    imageUrl:
      'https://static.displate.com/280x392/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2023-03-16/b3e18173c14ac378ed8cb01d68370d07_0cf91046043f832d17a577ad1cba69b9.jpg',
    },
    author: {
      fullName: 'Cyberpunk 2077 ',
    },
    brand: {
      name: 'Cyberpunk 2077',
    },
  },
  {
    id: 5225254,
    itemCollectionId: 6142808,
    collection: {
      id: 446328,
      name: 'Middle-Earth Maps',
      url: '/middle-earth/middle-earth-maps',
    },
    title: 'Middle-Earth Map',
    orientation: 'horizontal',
    exclusive: false,
    url: '/displate/6142808',
    imageUrl:
      'https://static.displate.com/392x280/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
    images: {
      mobile:
        'https://static.displate.com/190x135/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      mobileRetina:
        'https://static.displate.com/380x270/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      desktop:
        'https://static.displate.com/227x162/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
      desktopRetina:
        'https://static.displate.com/454x324/displate/2023-01-16/b93798ce998381127a05ac617e6b48ad_177f7347ce48327e276dbf115dfb3907.jpg',
    },
    author: {
      fullName: 'Middle-Earth ',
    },
    brand: {
      name: 'Middle-Earth',
    },
  },
  {
    id: 562752,
    itemCollectionId: 1017301,
    collection: {
      id: 149976,
      name: 'Neutral Deck',
      url: '/gwent/neutral-deck',
    },
    title: 'Roach',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/1017301',
    imageUrl:
      'https://static.displate.com/280x392/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2019-05-13/1daee6f5a30739fc72b7fdbbe62c6736_026672b5788d784fa75b20835f68ee68.jpg',
    },
    author: {
      fullName: 'GWENT ',
    },
    brand: {
      name: 'Gwent',
    },
  },
  {
    id: 4442340,
    itemCollectionId: 5335218,
    collection: {
      id: 120555,
      name: 'Digital Art',
      url: '/ciucinciu/digital-art',
    },
    title: 'Judgmental Duck',
    orientation: 'vertical',
    exclusive: false,
    url: '/displate/5335218',
    imageUrl:
      'https://static.displate.com/280x392/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
    images: {
      mobile:
        'https://static.displate.com/135x190/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      mobileRetina:
        'https://static.displate.com/270x380/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      desktop:
        'https://static.displate.com/162x227/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
      desktopRetina:
        'https://static.displate.com/324x454/displate/2022-02-06/4ee3be1bcb0ea252a08516433e814889_6f8e424c00f06f3bfa784d9f3d2bd127.jpg',
    },
    author: {
      fullName: 'Ciucinciu Tiberius',
    },
    brand: null,
  },
]

export default data
