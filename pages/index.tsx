import Container from "@/components/container";
import s from "@/styles/index.module.scss";
import Image from "next/image";
import profileImage from "../public/profile.png";
import { getClient } from "@/lib/sanity-server";
import { recentPostsQuery } from "@/lib/queries";
import { Post } from "@/lib/types";
import { InferGetStaticPropsType } from "next";
import { projects } from "@/lib/projects";
import Link from "next/link";

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container description="Software Engineer based in Kyiv, Ukraine.">
      <div className={s.info}>
        <div className={s["img-container"]}>
          <Image
            src={profileImage}
            placeholder="blur"
            alt="Profile"
            width={100}
            height={64}
            className={s.img}
          />
        </div>
        <div>
          <p className={s.name}>Alexey Miin</p>
          <p className={s.muted}>Software Engineer at Uvaga Communications Agency</p>
        </div>
      </div>
      <div className={s.about}>
        <p>Software Engineer based in Kyiv, Ukraine.</p>
      </div>
      <div className={s.content}>
        <section className={s.content}>
          <h1>Projects</h1>
          <div className={s.subcontent}>
            {projects.slice(0, 2).map((p) => (
              <div key={p.name}>
                <a href={p.href} target="_blank" className={s.subTitle}>
                  {p.name}
                </a>
                <p className={s.subDesc}>{p.description}</p>
              </div>
            ))}
            <div>
              <Link href="/projects" className={s.subTitle}>
                All projects
              </Link>
            </div>
          </div>
        </section>
        <section className={s.content}>
          <h1>Writing</h1>
          <div className={s.subcontent}>
            {posts.map((p) => (
              <div key={p._id}>
                <a href={`/writing/${p.slug}`} className={s.subTitle}>
                  {p.title}
                </a>
                <p className={s.subDesc}>{p.description}</p>
              </div>
            ))}
            <div>
              <Link href="/writing" className={s.subTitle}>
                All writing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}

export const getStaticProps = async ({ preview = false }) => {
  const posts: Post[] = await getClient(preview).fetch(recentPostsQuery);

  return { props: { posts } };
};
