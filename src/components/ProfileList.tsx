import { useEffect, useState } from "react";

// Impor fungsi API dan tipe data
import { fetchUsers } from "@/services/api";
import type { User } from "@/types/user";

// Impor komponen shadcn/ui (tidak berubah)
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Impor ikon (tidak berubah)
import { Mail, MapPin, UserCheck, AlertTriangle, SearchX } from "lucide-react";

// Komponen Skeleton (tidak berubah)
const ProfileCardSkeleton = () => (
  <div className="flex h-40 animate-pulse flex-col gap-4 rounded-xl bg-muted/50 p-4">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
    </div>
    <div className="h-4 w-1/3 rounded bg-muted" />
  </div>
);

interface ProfileListProps {
  searchTerm: string;
  genderFilter: string;
  natFilter: string;
  sortBy: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Komponen utama yang sudah direfactor
export function ProfileList({
  searchTerm,
  genderFilter,
  natFilter,
  sortBy,
  currentPage,
  onPageChange,
}: ProfileListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        results: "27",
      });

      if (genderFilter !== "all") params.append("gender", genderFilter);
      if (natFilter !== "all") params.append("nat", natFilter);

      // Hanya gunakan seed jika tidak ada filter aktif
      if (genderFilter === "all" && natFilter === "all") {
        params.append("seed", "humanshuffle123");
      }
      try {
        const response = await fetch(
          `https://randomuser.me/api/?${params.toString()}`
          );
          console.log("Mengirim permintaan ke:", response);
        if (!response.ok) throw new Error("Gagal mengambil data dari server.");

        let data = await response.json();
        let processedUsers = data.results;

        // 3. Logika filter pencarian (Client-side)
        if (searchTerm) {
          processedUsers = processedUsers.filter((user: User) =>
            `${user.name.first} ${user.name.last}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        const sortedUsers = [...processedUsers].sort((a, b) => {
          switch (sortBy) {
            case "name_asc":
              return (a.name?.first || "").localeCompare(b.name?.first || "");
            case "name_desc":
              return (b.name?.first || "").localeCompare(a.name?.first || "");
            case "age_asc":
              // Gunakan optional chaining (?.) dan default value (|| 0)
              return (a.dob?.age || 0) - (b.dob?.age || 0);
            case "age_desc":
              return (b.dob?.age || 0) - (a.dob?.age || 0);
            default:
              return 0; // Tidak ada pengurutan
          }
        });

        setUsers(sortedUsers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, searchTerm, genderFilter, natFilter, sortBy]); // <-- Tambahkan dependensi baru// <-- Tambahkan dependensi baru
  // Tampilan error yang lebih baik
  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-12 w-12" />
        <p className="mt-4 text-lg font-semibold">Oops! Terjadi Kesalahan</p>
        <p>{error}</p>
      </div>
    );
  }

  // JSX untuk tampilan (tidak ada perubahan signifikan, sama seperti sebelumnya)
  return (
    <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 27 }).map((_, index) => (
              <ProfileCardSkeleton key={index} />
            ))
          : users.map((user) => (
              <Card key={user.login.uuid} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 ">
                  <Avatar className="h-18 w-18">
                    <AvatarImage
                      src={user.picture.large}
                      alt={`${user.name.first} ${user.name.last}`}
                    />
                    <AvatarFallback>
                      {user.name.first[0]}
                      {user.name.last[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-start">
                      {user.name.first} {user.name.last}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </CardDescription>
                    <Badge
                      variant="outline"
                      className="flex w-fit items-center gap-1.5 mt-1"
                    >
                      <MapPin className="h-5 w-5" />
                      {user.location.city}, {user.location.country}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
      </div>
      {!isLoading && users.length === 0 && (
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl bg-muted/50">
          <SearchX className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            Tidak Ada Hasil
          </p>
          <p className="text-muted-foreground">
            Tidak ada pengguna yang cocok dengan kriteria Anda.
          </p>
        </div>
      )}
      {!isLoading && searchTerm === "" && users.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1); // Panggil onPageChange
                  }
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage + 1); // Panggil onPageChange
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
