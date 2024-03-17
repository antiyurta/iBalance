import RStorage1Filter from "../filters/RStorage1Filter";
import RStorage2Filter from "../filters/RStorage2Filter";
import RStorage3Filter from "../filters/RStorage3Filter";
import RStorage4Filter from "../filters/RStorage4Filter";
import RStorage5Filter from "../filters/RStorage5Filter";
import RStorage6Filter from "../filters/RStorage6Filter";
import RStorage1 from "../document/RStorage1";
import RStorage2 from "../document/RStorage2";
//Бараа материалын гүйлгээний тайлан
import RStorage3 from "../document/RStorage3";
//Агуулахын бүртгэл (гүйлгээний цонхоор)
import RStorage4 from "../document/RStorage4";
//Агуулахын бүртгэл (гүйлгээний утгаар)
import RStorage5 from "../document/RStorage5";
//Татан авалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage6 from "../document/RStorage6";
//Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage7 from "../document/RStorage7";
//Агуулах хоорондын хөдөлгөөний хураангуй тайлан
import RStorage8 from "../document/RStorage8";
//Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)
import RStorage9 from "../document/RStorage9";
//Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)
import RStorage10 from "../document/RStorage10";
//Материал хөрвүүлэлтийн тайлан (бараагаар)
import RStorage11 from "../document/RStorage11";
//Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)
import RStorage12 from "../document/RStorage12";
//Материал хольц, найруулгын тайлан (гүйлгээгээр)
import RStorage13 from "../document/RStorage13";
//Акт, хорогдол, устгалын товчоо тайлан
import RStorage14 from "../document/RStorage14";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)
import RStorage15 from "../document/RStorage15";
//Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage16 from "../document/RStorage16";
// Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)
import RStorage17 from "../document/RStorage17";
// Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)
import RStorage18 from "../document/RStorage18";
// Тооллогын тайлан
import RStorage19 from "../document/RStorage19";
// Тооллогын хуудас
import RStorage20 from "../document/RStorage20";
// Бараа материалын насжилтын тайлан
import RStorage21 from "../document/RStorage21";
// Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/
import RStorage22 from "../document/RStorage22";
// Бараа материалын үлдэгдэл тайлан /дуусах хугацаагаар/
import RStorage23 from "../document/RStorage23";

export interface IReport {
  key: string;
  title: string;
  filter: React.ReactNode;
  children: React.ReactNode;
}
export const reportList: IReport[] = [
    {
      key: "item-1",
      title: "Бараа материалын товчоо тайлан",
      filter: <RStorage1Filter />,
      children: <RStorage1 />,
    },
    {
      key: "item-2",
      title: "Бараа материалын товчоо тайлан (хураангуй)",
      filter: <RStorage1Filter />,
      children: <RStorage2 />,
    },
    {
      key: "item-3",
      title: "Бараа материалын гүйлгээний тайлан",
      filter: <RStorage2Filter />,
      children: <RStorage3 />,
    },
    {
      key: "item-4",
      title: "Агуулахын бүртгэл (гүйлгээний цонхоор)",
      filter: <RStorage2Filter />,
      children: <RStorage4 />,
    },
    {
      key: "item-5",
      title: "Агуулахын бүртгэл (гүйлгээний утгаар)",
      filter: <RStorage2Filter />,
      children: <RStorage5 />,
    },
    {
      key: "item-6",
      title: "Татан авалтын дэлгэрэнгүй тайлан (бараагаар)",
      filter: <RStorage5Filter />,
      children: <RStorage6 />,
    },
    {
      key: "item-7",
      title: "Татан авалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filter: <RStorage2Filter />,
      children: <RStorage7 />,
    },
    {
      key: "item-8",
      title: "Агуулах хоорондын хөдөлгөөний хураангуй тайлан",
      filter: <RStorage1Filter />,
      children: <RStorage8 />,
    },
    {
      key: "item-9",
      title: "Агуулах хоорондын хөдөлгөөний тайлан (бараагаар)",
      filter: <RStorage6Filter />,
      children: <RStorage9 />,
    },
    {
      key: "item-10",
      title: "Агуулах хоорондын хөдөлгөөний тайлан (гүйлгээгээр)",
      filter: <RStorage6Filter />,
      children: <RStorage10 />,
    },
    {
      key: "item-11",
      title: "Материал хөрвүүлэлтийн тайлан (бараагаар)",
      filter: <RStorage4Filter />,
      children: <RStorage11 />,
    },
    {
      key: "item-12",
      title: "Материал хөрвүүлэлтийн тайлан (гүйлгээгээр)",
      filter: <RStorage4Filter />,
      children: <RStorage12 />,
    },
    {
      key: "item-13",
      title: "Материал хольц, найруулгын тайлан (гүйлгээгээр)",
      filter: <RStorage4Filter />,
      children: <RStorage13 />,
    },
    {
      key: "item-14",
      title: "Акт, хорогдол, устгалын товчоо тайлан",
      filter: <RStorage1Filter />,
      children: <RStorage14 />,
    },
    {
      key: "item-15",
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (бараагаар)",
      filter: <RStorage5Filter />,
      children: <RStorage15 />,
    },
    {
      key: "item-16",
      title: "Акт, хорогдол, устгалын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filter: <RStorage5Filter />,
      children: <RStorage16 />,
    },
    {
      key: "item-17",
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (бараагаар)",
      filter: <RStorage5Filter />,
      children: <RStorage17 />,
    },
    {
      key: "item-18",
      title: "Зарцуулалтын дэлгэрэнгүй тайлан (гүйлгээгээр)",
      filter: <RStorage2Filter />,
      children: <RStorage18 />,
    },
    {
      key: "item-19",
      title: "Тооллогын тайлан",
      filter: <RStorage3Filter />,
      children: <RStorage19 />,
    },
    {
      key: "item-20",
      title: "Тооллогын хуудас",
      filter: <RStorage3Filter />,
      children: <RStorage20 />,
    },
    {
      key: "item-21",
      title: "Бараа материалын насжилтын тайлан",
      filter: <RStorage3Filter />,
      children: <RStorage21 />,
    },
    {
      key: "item-22",
      title: "Бараа материалын үлдэгдлийн жагсаалт /дуусах хугацаагаар/",
      filter: <RStorage3Filter />,
      children: <RStorage22 />,
    },
    {
      key: "item-23",
      title: "Бараа материалын үлдэгдлийн тайлан /дуусах хугацаагаар/",
      filter: <RStorage3Filter />,
      children: <RStorage23 />,
    },
  ];