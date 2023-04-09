import getSiteMeta from "~/utils/getSiteMeta";

const socialMetadata = {
  head() {
    const title = this.meta.title ?? "Заголовок блога"
    const description = this.meta.description
    const image = this.meta?.image
      ? this.meta.image
      : '/website.png'
    const keywords = this.metadata?.keywords
    const meta = [
        ...getSiteMeta(this.meta),
      {
        hid: 'keywords',
        name: 'keywords',
        content: keywords
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: description,
      },

      {
        property: "article:published_time",
        content: this.meta.createdAt,
      },
      {
        property: "article:modified_time",
        content: this.meta.updatedAt,
      },
      {
        property: "article:tag",
        content: this.meta.tags ? this.meta.tags.toString() : "",
      },
      { name: "twitter:label1", content: "Written by" },
      { name: "twitter:data1", content: "Bob Ross" },
      { name: "twitter:label2", content: "Filed under" },
      {
        name: "twitter:data2",
        content: this.meta.tags ? this.meta.tags.toString() : "",
      },
    ]

    const link = [
      {
        hid: "canonical",
        rel: "canonical",
        href: `https://bobross.com/articles/${this.$route.params.slug}`,
      },
    ];

    return {
      title,
      meta,
      link,
    }
  },
}

export default socialMetadata
