/* ================================================================
   USTAWIENIA SERWISU ZAMOŚĆ ZERO WASTE
   To jedyny plik, który trzeba edytować po wgraniu na serwer.
   Zmieniaj tylko tekst w cudzysłowach.
   ================================================================ */
const CONFIG = {
  // Adres e-mail, na który trafiają zgłoszenia warsztatów (formularz „Dodaj swój warsztat”).
  // Zostaw pusty "", jeśli formularz ma tylko pokazywać ten adres do skopiowania.
  email: "zak@zdk.zamosc.pl",

  // Telefon kontaktowy do koordynatora projektu (opcjonalnie), np. "+48 84 000 00 00".
  telefon: "",

  // Nazwa organizatora pokazywana w stopce, np. "Urząd Miasta Zamość, Wydział Kultury i Sportu".
  organizator: "Zamojska Akademia Kultury",

  // Adres osadzenia mapy z Moich Map Google (instrukcja w pliku INSTRUKCJA.txt, krok 3).
  // Wygląda tak: "https://www.google.com/maps/d/embed?mid=XXXXXXXX"
  // Gdy pusty, zamiast mapy pojawia się przycisk otwierający Mapy Google.
  mapaEmbed: "",

  // Opcjonalnie: adres, pod który formularz wysyła zgłoszenie metodą POST (np. skrypt na serwerze miasta
  // albo usługa formularzy). Gdy pusty, formularz otwiera program pocztowy z gotową wiadomością.
  formularzEndpoint: "",

  // Kawiarenki naprawcze i wydarzenia. Kopiuj blok { ... } i zmieniaj dane.
  // Data w formacie RRRR-MM-DD. Wydarzenia po terminie same znikają ze strony.
  wydarzenia: [
    // { tytul: "Kawiarenka naprawcza", data: "2026-11-14", godzina: "11:00", miejsce: "adres", opis: "Przynieś rzecz do naprawy." },
  ]
};
