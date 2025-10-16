import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProfileList } from "@/components/ProfileList";
import { SparklesCore } from "./components/ui/shadcn-io/sparkles";
import Shuffle from "./components/ui/shadcn-io/shuffle";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [natFilter, setNatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const handleFilterChange = (setter: Function, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="relative w-full bg-slate-950 font-geist">
          <div className="absolute inset-0 h-full w-full">
            <SparklesCore
              id="tsparticlesfullpage"
              background="#0a0a0a"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="h-full w-full"
              particleColor="#d4d4d4"
              speed={1}
            />
          </div>
          <div className="relative z-10 flex min-h-screen w-full flex-col items-center p-4 md:p-5">
            <div className="w-full max-w-7xl">
              <header className="flex w-full mt-3 mb-5">
                <div className="flex flex-row mt-6 sm:mt-8">
                  <div className="w-full flex-col font-geist">
                    <div className="flex flex-col sm:flex-row sm:items-end scroll-m-20 text-start items-start text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight text-balance">
                      <h1>HUMAN</h1>
                      <Shuffle
                        text="Shuffle."
                        triggerOnHover={true}
                        className="sm:ml-4 text-purple-300"
                      />
                    </div>
                    <p className="leading-7 [&:not(:first-child)]:mt-5 text-justify text-wrap max-w-2xl">
                      Human Shuffle memudahkan Anda untuk menjelajahi
                      keberagaman manusia di seluruh dunia secara instan. Dengan
                      sistem API yang mengambil data secara acak, setiap klik
                      akan menghadirkan orang berbeda.
                    </p>
                  </div>
                </div>
              </header>

              <section className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
                <Input
                  placeholder="Cari berdasarkan nama..."
                  className="w-full sm:flex-grow sm:max-w-xs"
                  value={searchTerm}
                  onChange={(e) =>
                    handleFilterChange(setSearchTerm, e.target.value)
                  }
                />
                <Select
                  value={genderFilter}
                  onValueChange={(value) =>
                    handleFilterChange(setGenderFilter, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Gender</SelectItem>
                    <SelectItem value="male">Pria</SelectItem>
                    <SelectItem value="female">Wanita</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={natFilter}
                  onValueChange={(value) =>
                    handleFilterChange(setNatFilter, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Nasionalitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Negara</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="gb">Great Britain</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    handleFilterChange(setSortBy, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Urutkan Berdasarkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                    <SelectItem value="age_asc">Umur (Muda ke Tua)</SelectItem>
                    <SelectItem value="age_desc">Umur (Tua ke Muda)</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              <main className="flex w-full mt-5">
                <ProfileList
                  searchTerm={searchTerm}
                  genderFilter={genderFilter}
                  natFilter={natFilter}
                  sortBy={sortBy}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
