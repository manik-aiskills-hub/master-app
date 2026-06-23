import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const chapters = [
  { day: 1, slug: "sich-vorstellen", de: "Sich vorstellen", en: "Introducing Yourself", words: [
    { de: "Name", en: "name", art: "der" }, { de: "Vorname", en: "first name", art: "der" },
    { de: "Nachname", en: "last name", art: "der" }, { de: "Alter", en: "age", art: "das" },
    { de: "Geburtstag", en: "birthday", art: "der" }, { de: "Beruf", en: "profession", art: "der" },
    { de: "Hobby", en: "hobby", art: "das" }, { de: "Land", en: "country", art: "das" },
    { de: "Stadt", en: "city", art: "die" }, { de: "Sprache", en: "language", art: "die" },
    { de: "Familie", en: "family", art: "die" }, { de: "Freund", en: "friend", art: "der" },
    { de: "Adresse", en: "address", art: "die" }, { de: "Telefonnummer", en: "phone number", art: "die" },
    { de: "Nationalität", en: "nationality", art: "die" }, { de: "Herkunft", en: "origin", art: "die" },
    { de: "Wohnort", en: "place of residence", art: "der" }, { de: "Heimat", en: "homeland", art: "die" },
    { de: "Muttersprache", en: "mother tongue", art: "die" }, { de: "Staatsangehörigkeit", en: "citizenship", art: "die" },
  ]},
  { day: 2, slug: "familie-und-freunde", de: "Familie und Freunde", en: "Family and Friends", words: [
    { de: "Eltern", en: "parents", art: "die" }, { de: "Mutter", en: "mother", art: "die" },
    { de: "Vater", en: "father", art: "der" }, { de: "Bruder", en: "brother", art: "der" },
    { de: "Schwester", en: "sister", art: "die" }, { de: "Kind", en: "child", art: "das" },
    { de: "Sohn", en: "son", art: "der" }, { de: "Tochter", en: "daughter", art: "die" },
    { de: "Großmutter", en: "grandmother", art: "die" }, { de: "Großvater", en: "grandfather", art: "der" },
    { de: "Onkel", en: "uncle", art: "der" }, { de: "Tante", en: "aunt", art: "die" },
    { de: "Cousin", en: "cousin (m)", art: "der" }, { de: "Cousine", en: "cousin (f)", art: "die" },
    { de: "Ehemann", en: "husband", art: "der" }, { de: "Ehefrau", en: "wife", art: "die" },
    { de: "Nachbar", en: "neighbor", art: "der" }, { de: "Bekannte", en: "acquaintance", art: "der/die" },
    { de: "Verwandte", en: "relative", art: "der/die" }, { de: "Enkel", en: "grandchild", art: "der" },
  ]},
  { day: 3, slug: "wohnen", de: "Wohnen", en: "Housing", words: [
    { de: "Wohnung", en: "apartment", art: "die" }, { de: "Haus", en: "house", art: "das" },
    { de: "Zimmer", en: "room", art: "das" }, { de: "Küche", en: "kitchen", art: "die" },
    { de: "Schlafzimmer", en: "bedroom", art: "das" }, { de: "Badezimmer", en: "bathroom", art: "das" },
    { de: "Wohnzimmer", en: "living room", art: "das" }, { de: "Balkon", en: "balcony", art: "der" },
    { de: "Garten", en: "garden", art: "der" }, { de: "Miete", en: "rent", art: "die" },
    { de: "Stock", en: "floor/story", art: "der" }, { de: "Aufzug", en: "elevator", art: "der" },
    { de: "Treppe", en: "stairs", art: "die" }, { de: "Möbel", en: "furniture", art: "die" },
    { de: "Tisch", en: "table", art: "der" }, { de: "Stuhl", en: "chair", art: "der" },
    { de: "Bett", en: "bed", art: "das" }, { de: "Schrank", en: "closet", art: "der" },
    { de: "Fenster", en: "window", art: "das" }, { de: "Tür", en: "door", art: "die" },
  ]},
  { day: 4, slug: "essen-und-trinken", de: "Essen und Trinken", en: "Food and Drink", words: [
    { de: "Frühstück", en: "breakfast", art: "das" }, { de: "Mittagessen", en: "lunch", art: "das" },
    { de: "Abendessen", en: "dinner", art: "das" }, { de: "Brot", en: "bread", art: "das" },
    { de: "Butter", en: "butter", art: "die" }, { de: "Käse", en: "cheese", art: "der" },
    { de: "Wurst", en: "sausage", art: "die" }, { de: "Fleisch", en: "meat", art: "das" },
    { de: "Gemüse", en: "vegetables", art: "das" }, { de: "Obst", en: "fruit", art: "das" },
    { de: "Reis", en: "rice", art: "der" }, { de: "Nudeln", en: "noodles", art: "die" },
    { de: "Suppe", en: "soup", art: "die" }, { de: "Salat", en: "salad", art: "der" },
    { de: "Kuchen", en: "cake", art: "der" }, { de: "Wasser", en: "water", art: "das" },
    { de: "Kaffee", en: "coffee", art: "der" }, { de: "Tee", en: "tea", art: "der" },
    { de: "Saft", en: "juice", art: "der" }, { de: "Milch", en: "milk", art: "die" },
  ]},
  { day: 5, slug: "einkaufen", de: "Einkaufen", en: "Shopping", words: [
    { de: "Geschäft", en: "shop", art: "das" }, { de: "Supermarkt", en: "supermarket", art: "der" },
    { de: "Markt", en: "market", art: "der" }, { de: "Preis", en: "price", art: "der" },
    { de: "Angebot", en: "offer", art: "das" }, { de: "Kasse", en: "checkout", art: "die" },
    { de: "Tasche", en: "bag", art: "die" }, { de: "Geld", en: "money", art: "das" },
    { de: "Rechnung", en: "bill", art: "die" }, { de: "Quittung", en: "receipt", art: "die" },
    { de: "Größe", en: "size", art: "die" }, { de: "Farbe", en: "color", art: "die" },
    { de: "billig", en: "cheap", art: null }, { de: "teuer", en: "expensive", art: null },
    { de: "Kleidung", en: "clothing", art: "die" }, { de: "Schuhe", en: "shoes", art: "die" },
    { de: "Hose", en: "pants", art: "die" }, { de: "Hemd", en: "shirt", art: "das" },
    { de: "Jacke", en: "jacket", art: "die" }, { de: "Rabatt", en: "discount", art: "der" },
  ]},
  { day: 6, slug: "gesundheit", de: "Gesundheit", en: "Health", words: [
    { de: "Arzt", en: "doctor", art: "der" }, { de: "Krankenhaus", en: "hospital", art: "das" },
    { de: "Apotheke", en: "pharmacy", art: "die" }, { de: "Medikament", en: "medication", art: "das" },
    { de: "Krankheit", en: "illness", art: "die" }, { de: "Schmerzen", en: "pain", art: "die" },
    { de: "Fieber", en: "fever", art: "das" }, { de: "Erkältung", en: "cold", art: "die" },
    { de: "Kopfschmerzen", en: "headache", art: "die" }, { de: "Bauchschmerzen", en: "stomachache", art: "die" },
    { de: "Rezept", en: "prescription", art: "das" }, { de: "Untersuchung", en: "examination", art: "die" },
    { de: "Termin", en: "appointment", art: "der" }, { de: "Versicherung", en: "insurance", art: "die" },
    { de: "Krankenkasse", en: "health insurance", art: "die" }, { de: "Tablette", en: "tablet/pill", art: "die" },
    { de: "Sprechstunde", en: "consultation hours", art: "die" }, { de: "Gesundheit", en: "health", art: "die" },
    { de: "Allergie", en: "allergy", art: "die" }, { de: "Verletzung", en: "injury", art: "die" },
  ]},
  { day: 7, slug: "arbeit-und-beruf", de: "Arbeit und Beruf", en: "Work and Career", words: [
    { de: "Arbeit", en: "work", art: "die" }, { de: "Arbeitsplatz", en: "workplace", art: "der" },
    { de: "Kollege", en: "colleague", art: "der" }, { de: "Chef", en: "boss", art: "der" },
    { de: "Gehalt", en: "salary", art: "das" }, { de: "Bewerbung", en: "application", art: "die" },
    { de: "Lebenslauf", en: "resume", art: "der" }, { de: "Vorstellungsgespräch", en: "job interview", art: "das" },
    { de: "Vertrag", en: "contract", art: "der" }, { de: "Urlaub", en: "vacation", art: "der" },
    { de: "Arbeitszeit", en: "working hours", art: "die" }, { de: "Teilzeit", en: "part-time", art: "die" },
    { de: "Vollzeit", en: "full-time", art: "die" }, { de: "Erfahrung", en: "experience", art: "die" },
    { de: "Ausbildung", en: "training", art: "die" }, { de: "Praktikum", en: "internship", art: "das" },
    { de: "Kündigung", en: "termination", art: "die" }, { de: "Firma", en: "company", art: "die" },
    { de: "Büro", en: "office", art: "das" }, { de: "Aufgabe", en: "task", art: "die" },
  ]},
  { day: 8, slug: "schule-und-bildung", de: "Schule und Bildung", en: "School and Education", words: [
    { de: "Schule", en: "school", art: "die" }, { de: "Universität", en: "university", art: "die" },
    { de: "Unterricht", en: "lesson", art: "der" }, { de: "Kurs", en: "course", art: "der" },
    { de: "Prüfung", en: "exam", art: "die" }, { de: "Note", en: "grade", art: "die" },
    { de: "Zeugnis", en: "certificate", art: "das" }, { de: "Lehrer", en: "teacher", art: "der" },
    { de: "Schüler", en: "student", art: "der" }, { de: "Hausaufgabe", en: "homework", art: "die" },
    { de: "Fach", en: "subject", art: "das" }, { de: "Abschluss", en: "degree", art: "der" },
    { de: "Bibliothek", en: "library", art: "die" }, { de: "Wörterbuch", en: "dictionary", art: "das" },
    { de: "Übung", en: "exercise", art: "die" }, { de: "Klasse", en: "class", art: "die" },
    { de: "Semester", en: "semester", art: "das" }, { de: "Studium", en: "studies", art: "das" },
    { de: "Kenntnis", en: "knowledge", art: "die" }, { de: "Fortschritt", en: "progress", art: "der" },
  ]},
  { day: 9, slug: "freizeit", de: "Freizeit", en: "Free Time", words: [
    { de: "Sport", en: "sport", art: "der" }, { de: "Musik", en: "music", art: "die" },
    { de: "Film", en: "movie", art: "der" }, { de: "Buch", en: "book", art: "das" },
    { de: "Kino", en: "cinema", art: "das" }, { de: "Theater", en: "theater", art: "das" },
    { de: "Museum", en: "museum", art: "das" }, { de: "Konzert", en: "concert", art: "das" },
    { de: "Park", en: "park", art: "der" }, { de: "Schwimmbad", en: "swimming pool", art: "das" },
    { de: "Verein", en: "club/association", art: "der" }, { de: "Spiel", en: "game", art: "das" },
    { de: "Ausflug", en: "excursion", art: "der" }, { de: "Wanderung", en: "hike", art: "die" },
    { de: "Fahrrad", en: "bicycle", art: "das" }, { de: "Mannschaft", en: "team", art: "die" },
    { de: "Veranstaltung", en: "event", art: "die" }, { de: "Zeitschrift", en: "magazine", art: "die" },
    { de: "Fernsehen", en: "television", art: "das" }, { de: "Entspannung", en: "relaxation", art: "die" },
  ]},
  { day: 10, slug: "reisen", de: "Reisen", en: "Travel", words: [
    { de: "Reise", en: "trip", art: "die" }, { de: "Flugzeug", en: "airplane", art: "das" },
    { de: "Bahnhof", en: "train station", art: "der" }, { de: "Zug", en: "train", art: "der" },
    { de: "Flughafen", en: "airport", art: "der" }, { de: "Hotel", en: "hotel", art: "das" },
    { de: "Koffer", en: "suitcase", art: "der" }, { de: "Pass", en: "passport", art: "der" },
    { de: "Fahrkarte", en: "ticket", art: "die" }, { de: "Abfahrt", en: "departure", art: "die" },
    { de: "Ankunft", en: "arrival", art: "die" }, { de: "Verspätung", en: "delay", art: "die" },
    { de: "Gepäck", en: "luggage", art: "das" }, { de: "Unterkunft", en: "accommodation", art: "die" },
    { de: "Sehenswürdigkeit", en: "sight/attraction", art: "die" }, { de: "Ausland", en: "abroad", art: "das" },
    { de: "Visum", en: "visa", art: "das" }, { de: "Buchung", en: "booking", art: "die" },
    { de: "Rundfahrt", en: "tour", art: "die" }, { de: "Landschaft", en: "landscape", art: "die" },
  ]},
  { day: 11, slug: "verkehr", de: "Verkehr", en: "Traffic and Transport", words: [
    { de: "Auto", en: "car", art: "das" }, { de: "Bus", en: "bus", art: "der" },
    { de: "Straßenbahn", en: "tram", art: "die" }, { de: "U-Bahn", en: "subway", art: "die" },
    { de: "Haltestelle", en: "stop", art: "die" }, { de: "Straße", en: "street", art: "die" },
    { de: "Kreuzung", en: "intersection", art: "die" }, { de: "Ampel", en: "traffic light", art: "die" },
    { de: "Führerschein", en: "driver's license", art: "der" }, { de: "Tankstelle", en: "gas station", art: "die" },
    { de: "Parkplatz", en: "parking lot", art: "der" }, { de: "Stau", en: "traffic jam", art: "der" },
    { de: "Fahrplan", en: "schedule", art: "der" }, { de: "Richtung", en: "direction", art: "die" },
    { de: "Geschwindigkeit", en: "speed", art: "die" }, { de: "Unfall", en: "accident", art: "der" },
    { de: "Fußgänger", en: "pedestrian", art: "der" }, { de: "Radweg", en: "bike path", art: "der" },
    { de: "Verkehrsmittel", en: "means of transport", art: "das" }, { de: "Umleitung", en: "detour", art: "die" },
  ]},
  { day: 12, slug: "wetter", de: "Wetter", en: "Weather", words: [
    { de: "Sonne", en: "sun", art: "die" }, { de: "Regen", en: "rain", art: "der" },
    { de: "Schnee", en: "snow", art: "der" }, { de: "Wind", en: "wind", art: "der" },
    { de: "Wolke", en: "cloud", art: "die" }, { de: "Gewitter", en: "thunderstorm", art: "das" },
    { de: "Temperatur", en: "temperature", art: "die" }, { de: "Grad", en: "degree", art: "der" },
    { de: "warm", en: "warm", art: null }, { de: "kalt", en: "cold", art: null },
    { de: "heiß", en: "hot", art: null }, { de: "kühl", en: "cool", art: null },
    { de: "Nebel", en: "fog", art: "der" }, { de: "Eis", en: "ice", art: "das" },
    { de: "Frühling", en: "spring", art: "der" }, { de: "Sommer", en: "summer", art: "der" },
    { de: "Herbst", en: "autumn", art: "der" }, { de: "Winter", en: "winter", art: "der" },
    { de: "Vorhersage", en: "forecast", art: "die" }, { de: "Klima", en: "climate", art: "das" },
  ]},
  { day: 13, slug: "medien-und-technik", de: "Medien und Technik", en: "Media and Technology", words: [
    { de: "Computer", en: "computer", art: "der" }, { de: "Handy", en: "cell phone", art: "das" },
    { de: "Internet", en: "internet", art: "das" }, { de: "E-Mail", en: "email", art: "die" },
    { de: "Nachricht", en: "message", art: "die" }, { de: "Zeitung", en: "newspaper", art: "die" },
    { de: "Radio", en: "radio", art: "das" }, { de: "Sendung", en: "broadcast", art: "die" },
    { de: "Programm", en: "program", art: "das" }, { de: "Bildschirm", en: "screen", art: "der" },
    { de: "Taste", en: "key/button", art: "die" }, { de: "Drucker", en: "printer", art: "der" },
    { de: "Datei", en: "file", art: "die" }, { de: "Passwort", en: "password", art: "das" },
    { de: "Netzwerk", en: "network", art: "das" }, { de: "Anruf", en: "phone call", art: "der" },
    { de: "Verbindung", en: "connection", art: "die" }, { de: "Webseite", en: "website", art: "die" },
    { de: "Anwendung", en: "application", art: "die" }, { de: "Kamera", en: "camera", art: "die" },
  ]},
  { day: 14, slug: "natur-und-umwelt", de: "Natur und Umwelt", en: "Nature and Environment", words: [
    { de: "Baum", en: "tree", art: "der" }, { de: "Blume", en: "flower", art: "die" },
    { de: "Berg", en: "mountain", art: "der" }, { de: "See", en: "lake", art: "der" },
    { de: "Meer", en: "sea", art: "das" }, { de: "Fluss", en: "river", art: "der" },
    { de: "Wald", en: "forest", art: "der" }, { de: "Tier", en: "animal", art: "das" },
    { de: "Umwelt", en: "environment", art: "die" }, { de: "Müll", en: "garbage", art: "der" },
    { de: "Recycling", en: "recycling", art: "das" }, { de: "Energie", en: "energy", art: "die" },
    { de: "Verschmutzung", en: "pollution", art: "die" }, { de: "Luft", en: "air", art: "die" },
    { de: "Schutz", en: "protection", art: "der" }, { de: "Erde", en: "earth", art: "die" },
    { de: "Pflanze", en: "plant", art: "die" }, { de: "Gras", en: "grass", art: "das" },
    { de: "Himmel", en: "sky", art: "der" }, { de: "Stern", en: "star", art: "der" },
  ]},
  { day: 15, slug: "feste-und-feiertage", de: "Feste und Feiertage", en: "Celebrations and Holidays", words: [
    { de: "Weihnachten", en: "Christmas", art: "das" }, { de: "Ostern", en: "Easter", art: "das" },
    { de: "Geburtstag", en: "birthday", art: "der" }, { de: "Hochzeit", en: "wedding", art: "die" },
    { de: "Feier", en: "celebration", art: "die" }, { de: "Einladung", en: "invitation", art: "die" },
    { de: "Geschenk", en: "gift", art: "das" }, { de: "Kuchen", en: "cake", art: "der" },
    { de: "Kerze", en: "candle", art: "die" }, { de: "Tradition", en: "tradition", art: "die" },
    { de: "Silvester", en: "New Year's Eve", art: "das" }, { de: "Karneval", en: "carnival", art: "der" },
    { de: "Fest", en: "festival", art: "das" }, { de: "Gast", en: "guest", art: "der" },
    { de: "Glückwunsch", en: "congratulations", art: "der" }, { de: "Feuerwerk", en: "fireworks", art: "das" },
    { de: "Brauch", en: "custom", art: "der" }, { de: "Feiertag", en: "holiday", art: "der" },
    { de: "Schmuck", en: "decoration", art: "der" }, { de: "Stimmung", en: "mood/atmosphere", art: "die" },
  ]},
  { day: 16, slug: "koerper-und-aussehen", de: "Körper und Aussehen", en: "Body and Appearance", words: [
    { de: "Kopf", en: "head", art: "der" }, { de: "Auge", en: "eye", art: "das" },
    { de: "Nase", en: "nose", art: "die" }, { de: "Mund", en: "mouth", art: "der" },
    { de: "Ohr", en: "ear", art: "das" }, { de: "Haar", en: "hair", art: "das" },
    { de: "Hand", en: "hand", art: "die" }, { de: "Fuß", en: "foot", art: "der" },
    { de: "Arm", en: "arm", art: "der" }, { de: "Bein", en: "leg", art: "das" },
    { de: "Rücken", en: "back", art: "der" }, { de: "Bauch", en: "stomach", art: "der" },
    { de: "Finger", en: "finger", art: "der" }, { de: "Zahn", en: "tooth", art: "der" },
    { de: "Gesicht", en: "face", art: "das" }, { de: "Schulter", en: "shoulder", art: "die" },
    { de: "Haut", en: "skin", art: "die" }, { de: "groß", en: "tall", art: null },
    { de: "klein", en: "small/short", art: null }, { de: "schlank", en: "slim", art: null },
  ]},
  { day: 17, slug: "gefuehle", de: "Gefühle", en: "Feelings and Emotions", words: [
    { de: "Freude", en: "joy", art: "die" }, { de: "Angst", en: "fear", art: "die" },
    { de: "Liebe", en: "love", art: "die" }, { de: "Trauer", en: "sadness", art: "die" },
    { de: "Wut", en: "anger", art: "die" }, { de: "Glück", en: "happiness", art: "das" },
    { de: "Hoffnung", en: "hope", art: "die" }, { de: "Überraschung", en: "surprise", art: "die" },
    { de: "Langeweile", en: "boredom", art: "die" }, { de: "Sorge", en: "worry", art: "die" },
    { de: "froh", en: "glad", art: null }, { de: "traurig", en: "sad", art: null },
    { de: "müde", en: "tired", art: null }, { de: "nervös", en: "nervous", art: null },
    { de: "zufrieden", en: "satisfied", art: null }, { de: "enttäuscht", en: "disappointed", art: null },
    { de: "stolz", en: "proud", art: null }, { de: "einsam", en: "lonely", art: null },
    { de: "aufgeregt", en: "excited", art: null }, { de: "dankbar", en: "grateful", art: null },
  ]},
  { day: 18, slug: "bank-und-post", de: "Bank und Post", en: "Bank and Post Office", words: [
    { de: "Konto", en: "account", art: "das" }, { de: "Überweisung", en: "transfer", art: "die" },
    { de: "Geldautomat", en: "ATM", art: "der" }, { de: "Kreditkarte", en: "credit card", art: "die" },
    { de: "Bargeld", en: "cash", art: "das" }, { de: "Sparkasse", en: "savings bank", art: "die" },
    { de: "Zinsen", en: "interest", art: "die" }, { de: "Schulden", en: "debts", art: "die" },
    { de: "Brief", en: "letter", art: "der" }, { de: "Paket", en: "package", art: "das" },
    { de: "Briefmarke", en: "stamp", art: "die" }, { de: "Absender", en: "sender", art: "der" },
    { de: "Empfänger", en: "recipient", art: "der" }, { de: "Postleitzahl", en: "zip code", art: "die" },
    { de: "Formular", en: "form", art: "das" }, { de: "Unterschrift", en: "signature", art: "die" },
    { de: "Einzahlung", en: "deposit", art: "die" }, { de: "Auszahlung", en: "withdrawal", art: "die" },
    { de: "Kontoauszug", en: "bank statement", art: "der" }, { de: "Gebühr", en: "fee", art: "die" },
  ]},
  { day: 19, slug: "behoerden", de: "Behörden", en: "Government Offices", words: [
    { de: "Amt", en: "office/authority", art: "das" }, { de: "Ausweis", en: "ID card", art: "der" },
    { de: "Anmeldung", en: "registration", art: "die" }, { de: "Antrag", en: "application/request", art: "der" },
    { de: "Genehmigung", en: "permission", art: "die" }, { de: "Bescheinigung", en: "certificate", art: "die" },
    { de: "Dokument", en: "document", art: "das" }, { de: "Stempel", en: "stamp", art: "der" },
    { de: "Beamte", en: "civil servant", art: "der" }, { de: "Wartenummer", en: "waiting number", art: "die" },
    { de: "Aufenthalt", en: "residence", art: "der" }, { de: "Erlaubnis", en: "permit", art: "die" },
    { de: "Bürgeramt", en: "citizens' office", art: "das" }, { de: "Ausländerbehörde", en: "immigration office", art: "die" },
    { de: "Meldebescheinigung", en: "registration certificate", art: "die" }, { de: "Standesamt", en: "registry office", art: "das" },
    { de: "Steuer", en: "tax", art: "die" }, { de: "Geburtsurkunde", en: "birth certificate", art: "die" },
    { de: "Vollmacht", en: "power of attorney", art: "die" }, { de: "Frist", en: "deadline", art: "die" },
  ]},
  { day: 20, slug: "kultur", de: "Kultur", en: "Culture", words: [
    { de: "Kunst", en: "art", art: "die" }, { de: "Ausstellung", en: "exhibition", art: "die" },
    { de: "Gemälde", en: "painting", art: "das" }, { de: "Skulptur", en: "sculpture", art: "die" },
    { de: "Galerie", en: "gallery", art: "die" }, { de: "Künstler", en: "artist", art: "der" },
    { de: "Roman", en: "novel", art: "der" }, { de: "Gedicht", en: "poem", art: "das" },
    { de: "Autor", en: "author", art: "der" }, { de: "Dichter", en: "poet", art: "der" },
    { de: "Oper", en: "opera", art: "die" }, { de: "Tanz", en: "dance", art: "der" },
    { de: "Bühne", en: "stage", art: "die" }, { de: "Schauspieler", en: "actor", art: "der" },
    { de: "Regisseur", en: "director", art: "der" }, { de: "Publikum", en: "audience", art: "das" },
    { de: "Vorstellung", en: "performance", art: "die" }, { de: "Eintrittskarte", en: "admission ticket", art: "die" },
    { de: "Kritik", en: "criticism", art: "die" }, { de: "Geschichte", en: "story/history", art: "die" },
  ]},
  { day: 21, slug: "politik-und-gesellschaft", de: "Politik und Gesellschaft", en: "Politics and Society", words: [
    { de: "Regierung", en: "government", art: "die" }, { de: "Wahl", en: "election", art: "die" },
    { de: "Partei", en: "party", art: "die" }, { de: "Gesetz", en: "law", art: "das" },
    { de: "Demokratie", en: "democracy", art: "die" }, { de: "Freiheit", en: "freedom", art: "die" },
    { de: "Gleichberechtigung", en: "equal rights", art: "die" }, { de: "Bürger", en: "citizen", art: "der" },
    { de: "Gesellschaft", en: "society", art: "die" }, { de: "Meinung", en: "opinion", art: "die" },
    { de: "Demonstration", en: "demonstration", art: "die" }, { de: "Recht", en: "right/law", art: "das" },
    { de: "Pflicht", en: "duty", art: "die" }, { de: "Integration", en: "integration", art: "die" },
    { de: "Migration", en: "migration", art: "die" }, { de: "Flüchtling", en: "refugee", art: "der" },
    { de: "Verhandlung", en: "negotiation", art: "die" }, { de: "Abstimmung", en: "vote", art: "die" },
    { de: "Grundgesetz", en: "constitution", art: "das" }, { de: "Wahlrecht", en: "right to vote", art: "das" },
  ]},
  { day: 22, slug: "im-restaurant", de: "Im Restaurant", en: "At the Restaurant", words: [
    { de: "Speisekarte", en: "menu", art: "die" }, { de: "Vorspeise", en: "appetizer", art: "die" },
    { de: "Hauptgericht", en: "main course", art: "das" }, { de: "Nachtisch", en: "dessert", art: "der" },
    { de: "Getränk", en: "beverage", art: "das" }, { de: "Kellner", en: "waiter", art: "der" },
    { de: "Bestellung", en: "order", art: "die" }, { de: "Trinkgeld", en: "tip", art: "das" },
    { de: "Teller", en: "plate", art: "der" }, { de: "Gabel", en: "fork", art: "die" },
    { de: "Messer", en: "knife", art: "das" }, { de: "Löffel", en: "spoon", art: "der" },
    { de: "Glas", en: "glass", art: "das" }, { de: "Flasche", en: "bottle", art: "die" },
    { de: "Reservierung", en: "reservation", art: "die" }, { de: "Rechnung", en: "bill", art: "die" },
    { de: "Portion", en: "portion", art: "die" }, { de: "Beilage", en: "side dish", art: "die" },
    { de: "vegetarisch", en: "vegetarian", art: null }, { de: "Empfehlung", en: "recommendation", art: "die" },
  ]},
  { day: 23, slug: "sport-und-fitness", de: "Sport und Fitness", en: "Sports and Fitness", words: [
    { de: "Fußball", en: "soccer", art: "der" }, { de: "Schwimmen", en: "swimming", art: "das" },
    { de: "Laufen", en: "running", art: "das" }, { de: "Tennis", en: "tennis", art: "das" },
    { de: "Fitnessstudio", en: "gym", art: "das" }, { de: "Training", en: "training", art: "das" },
    { de: "Wettkampf", en: "competition", art: "der" }, { de: "Spieler", en: "player", art: "der" },
    { de: "Trainer", en: "coach", art: "der" }, { de: "Ergebnis", en: "result", art: "das" },
    { de: "Tor", en: "goal", art: "das" }, { de: "Sieg", en: "victory", art: "der" },
    { de: "Niederlage", en: "defeat", art: "die" }, { de: "Mannschaft", en: "team", art: "die" },
    { de: "Turnier", en: "tournament", art: "das" }, { de: "Medaille", en: "medal", art: "die" },
    { de: "Stadion", en: "stadium", art: "das" }, { de: "Zuschauer", en: "spectator", art: "der" },
    { de: "Bewegung", en: "movement/exercise", art: "die" }, { de: "Ausdauer", en: "endurance", art: "die" },
  ]},
  { day: 24, slug: "recht-und-ordnung", de: "Recht und Ordnung", en: "Law and Order", words: [
    { de: "Polizei", en: "police", art: "die" }, { de: "Gericht", en: "court", art: "das" },
    { de: "Anwalt", en: "lawyer", art: "der" }, { de: "Richter", en: "judge", art: "der" },
    { de: "Verbrechen", en: "crime", art: "das" }, { de: "Diebstahl", en: "theft", art: "der" },
    { de: "Strafe", en: "punishment", art: "die" }, { de: "Anzeige", en: "report/complaint", art: "die" },
    { de: "Zeuge", en: "witness", art: "der" }, { de: "Beweis", en: "evidence", art: "der" },
    { de: "Urteil", en: "verdict", art: "das" }, { de: "Gefängnis", en: "prison", art: "das" },
    { de: "Opfer", en: "victim", art: "das" }, { de: "Täter", en: "perpetrator", art: "der" },
    { de: "Notruf", en: "emergency call", art: "der" }, { de: "Feuerwehr", en: "fire department", art: "die" },
    { de: "Rettungsdienst", en: "rescue service", art: "der" }, { de: "Sicherheit", en: "safety", art: "die" },
    { de: "Verbot", en: "prohibition", art: "das" }, { de: "Regel", en: "rule", art: "die" },
  ]},
  { day: 25, slug: "telekommunikation", de: "Telekommunikation", en: "Telecommunications", words: [
    { de: "Telefon", en: "telephone", art: "das" }, { de: "Anruf", en: "call", art: "der" },
    { de: "Mailbox", en: "voicemail", art: "die" }, { de: "SMS", en: "text message", art: "die" },
    { de: "Vertrag", en: "contract", art: "der" }, { de: "Tarif", en: "rate/plan", art: "der" },
    { de: "Prepaid", en: "prepaid", art: null }, { de: "SIM-Karte", en: "SIM card", art: "die" },
    { de: "Empfang", en: "reception", art: "der" }, { de: "Festnetz", en: "landline", art: "das" },
    { de: "Mobilfunk", en: "mobile network", art: "der" }, { de: "Anbieter", en: "provider", art: "der" },
    { de: "Rechnung", en: "bill", art: "die" }, { de: "Flatrate", en: "flat rate", art: "die" },
    { de: "Datenvolumen", en: "data volume", art: "das" }, { de: "Roaming", en: "roaming", art: "das" },
    { de: "Kundenservice", en: "customer service", art: "der" }, { de: "Beschwerde", en: "complaint", art: "die" },
    { de: "Laufzeit", en: "contract period", art: "die" }, { de: "Kündigung", en: "cancellation", art: "die" },
  ]},
  { day: 26, slug: "wohnung-suchen", de: "Wohnungssuche", en: "Apartment Hunting", words: [
    { de: "Anzeige", en: "advertisement", art: "die" }, { de: "Besichtigung", en: "viewing", art: "die" },
    { de: "Mietvertrag", en: "rental agreement", art: "der" }, { de: "Kaution", en: "deposit", art: "die" },
    { de: "Nebenkosten", en: "utility costs", art: "die" }, { de: "Vermieter", en: "landlord", art: "der" },
    { de: "Mieter", en: "tenant", art: "der" }, { de: "Quadratmeter", en: "square meter", art: "der" },
    { de: "Einzug", en: "moving in", art: "der" }, { de: "Umzug", en: "move", art: "der" },
    { de: "Renovierung", en: "renovation", art: "die" }, { de: "Makler", en: "real estate agent", art: "der" },
    { de: "Kaltmiete", en: "base rent", art: "die" }, { de: "Warmmiete", en: "rent incl. utilities", art: "die" },
    { de: "Erdgeschoss", en: "ground floor", art: "das" }, { de: "Dachgeschoss", en: "attic floor", art: "das" },
    { de: "Heizung", en: "heating", art: "die" }, { de: "Strom", en: "electricity", art: "der" },
    { de: "Nachbar", en: "neighbor", art: "der" }, { de: "Hausordnung", en: "house rules", art: "die" },
  ]},
  { day: 27, slug: "nachrichten", de: "Nachrichten", en: "News", words: [
    { de: "Bericht", en: "report", art: "der" }, { de: "Schlagzeile", en: "headline", art: "die" },
    { de: "Journalist", en: "journalist", art: "der" }, { de: "Interview", en: "interview", art: "das" },
    { de: "Kommentar", en: "comment", art: "der" }, { de: "Meldung", en: "news item", art: "die" },
    { de: "Quelle", en: "source", art: "die" }, { de: "Tagesschau", en: "daily news", art: "die" },
    { de: "Artikel", en: "article", art: "der" }, { de: "Redaktion", en: "editorial office", art: "die" },
    { de: "Katastrophe", en: "catastrophe", art: "die" }, { de: "Wirtschaft", en: "economy", art: "die" },
    { de: "Außenpolitik", en: "foreign policy", art: "die" }, { de: "Innenpolitik", en: "domestic policy", art: "die" },
    { de: "Aktuell", en: "current", art: null }, { de: "Ereignis", en: "event", art: "das" },
    { de: "Umfrage", en: "survey", art: "die" }, { de: "Statistik", en: "statistics", art: "die" },
    { de: "Presse", en: "press", art: "die" }, { de: "Korrespondent", en: "correspondent", art: "der" },
  ]},
  { day: 28, slug: "briefe-schreiben", de: "Briefe schreiben", en: "Writing Letters", words: [
    { de: "Anrede", en: "salutation", art: "die" }, { de: "Betreff", en: "subject", art: "der" },
    { de: "Absender", en: "sender", art: "der" }, { de: "Empfänger", en: "recipient", art: "der" },
    { de: "Anlage", en: "attachment", art: "die" }, { de: "Grußformel", en: "closing formula", art: "die" },
    { de: "Mitteilung", en: "notification", art: "die" }, { de: "Bitte", en: "request", art: "die" },
    { de: "Entschuldigung", en: "apology", art: "die" }, { de: "Dank", en: "thanks", art: "der" },
    { de: "Kündigung", en: "cancellation", art: "die" }, { de: "Beschwerde", en: "complaint", art: "die" },
    { de: "Anfrage", en: "inquiry", art: "die" }, { de: "Bestätigung", en: "confirmation", art: "die" },
    { de: "Einladung", en: "invitation", art: "die" }, { de: "Absage", en: "cancellation/refusal", art: "die" },
    { de: "Zusage", en: "acceptance", art: "die" }, { de: "Termin", en: "appointment", art: "der" },
    { de: "Höflichkeit", en: "politeness", art: "die" }, { de: "Förmlich", en: "formal", art: null },
  ]},
  { day: 29, slug: "pruefungsvorbereitung-1", de: "Prüfungsvorbereitung Teil 1", en: "Exam Prep Part 1", words: [
    { de: "Aufgabe", en: "task", art: "die" }, { de: "Antwort", en: "answer", art: "die" },
    { de: "Frage", en: "question", art: "die" }, { de: "Lösung", en: "solution", art: "die" },
    { de: "richtig", en: "correct", art: null }, { de: "falsch", en: "wrong", art: null },
    { de: "Beispiel", en: "example", art: "das" }, { de: "Erklärung", en: "explanation", art: "die" },
    { de: "Bedeutung", en: "meaning", art: "die" }, { de: "Zusammenfassung", en: "summary", art: "die" },
    { de: "Absatz", en: "paragraph", art: "der" }, { de: "Überschrift", en: "heading", art: "die" },
    { de: "Auswahl", en: "selection", art: "die" }, { de: "Reihenfolge", en: "order/sequence", art: "die" },
    { de: "Zuordnung", en: "matching", art: "die" }, { de: "Lücke", en: "gap", art: "die" },
    { de: "Textverständnis", en: "reading comprehension", art: "das" }, { de: "Hörverständnis", en: "listening comprehension", art: "das" },
    { de: "Ausdruck", en: "expression", art: "der" }, { de: "Wortschatz", en: "vocabulary", art: "der" },
  ]},
  { day: 30, slug: "pruefungsvorbereitung-2", de: "Prüfungsvorbereitung Teil 2", en: "Exam Prep Part 2", words: [
    { de: "Grammatik", en: "grammar", art: "die" }, { de: "Satzbau", en: "sentence structure", art: "der" },
    { de: "Verb", en: "verb", art: "das" }, { de: "Substantiv", en: "noun", art: "das" },
    { de: "Adjektiv", en: "adjective", art: "das" }, { de: "Präposition", en: "preposition", art: "die" },
    { de: "Konjunktion", en: "conjunction", art: "die" }, { de: "Pronomen", en: "pronoun", art: "das" },
    { de: "Artikel", en: "article", art: "der" }, { de: "Plural", en: "plural", art: "der" },
    { de: "Singular", en: "singular", art: "der" }, { de: "Akkusativ", en: "accusative", art: "der" },
    { de: "Dativ", en: "dative", art: "der" }, { de: "Genitiv", en: "genitive", art: "der" },
    { de: "Nominativ", en: "nominative", art: "der" }, { de: "Konjugation", en: "conjugation", art: "die" },
    { de: "Deklination", en: "declension", art: "die" }, { de: "Zeitform", en: "tense", art: "die" },
    { de: "Nebensatz", en: "subordinate clause", art: "der" }, { de: "Hauptsatz", en: "main clause", art: "der" },
  ]},
];

interface VerbSeed {
  inf: string; en: string; aux: string; pp: string; pret: string | null; irreg: boolean;
  ich: string; du: string; er: string; wir: string; ihr: string; sie: string;
}

const chapterVerbs: Record<string, VerbSeed[]> = {
  "sich-vorstellen": [
    { inf: "heißen", en: "to be called", aux: "haben", pp: "geheißen", pret: "hieß", irreg: true, ich: "heiße", du: "heißt", er: "heißt", wir: "heißen", ihr: "heißt", sie: "heißen" },
    { inf: "kommen", en: "to come", aux: "sein", pp: "gekommen", pret: "kam", irreg: true, ich: "komme", du: "kommst", er: "kommt", wir: "kommen", ihr: "kommt", sie: "kommen" },
    { inf: "wohnen", en: "to live", aux: "haben", pp: "gewohnt", pret: "wohnte", irreg: false, ich: "wohne", du: "wohnst", er: "wohnt", wir: "wohnen", ihr: "wohnt", sie: "wohnen" },
    { inf: "sprechen", en: "to speak", aux: "haben", pp: "gesprochen", pret: "sprach", irreg: true, ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen" },
    { inf: "arbeiten", en: "to work", aux: "haben", pp: "gearbeitet", pret: "arbeitete", irreg: false, ich: "arbeite", du: "arbeitest", er: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie: "arbeiten" },
    { inf: "lernen", en: "to learn", aux: "haben", pp: "gelernt", pret: "lernte", irreg: false, ich: "lerne", du: "lernst", er: "lernt", wir: "lernen", ihr: "lernt", sie: "lernen" },
    { inf: "sein", en: "to be", aux: "sein", pp: "gewesen", pret: "war", irreg: true, ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind" },
    { inf: "haben", en: "to have", aux: "haben", pp: "gehabt", pret: "hatte", irreg: true, ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben" },
    { inf: "machen", en: "to make/do", aux: "haben", pp: "gemacht", pret: "machte", irreg: false, ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen" },
    { inf: "kennen", en: "to know", aux: "haben", pp: "gekannt", pret: "kannte", irreg: true, ich: "kenne", du: "kennst", er: "kennt", wir: "kennen", ihr: "kennt", sie: "kennen" },
  ],
  "familie-und-freunde": [
    { inf: "lieben", en: "to love", aux: "haben", pp: "geliebt", pret: "liebte", irreg: false, ich: "liebe", du: "liebst", er: "liebt", wir: "lieben", ihr: "liebt", sie: "lieben" },
    { inf: "besuchen", en: "to visit", aux: "haben", pp: "besucht", pret: "besuchte", irreg: false, ich: "besuche", du: "besuchst", er: "besucht", wir: "besuchen", ihr: "besucht", sie: "besuchen" },
    { inf: "heiraten", en: "to marry", aux: "haben", pp: "geheiratet", pret: "heiratete", irreg: false, ich: "heirate", du: "heiratest", er: "heiratet", wir: "heiraten", ihr: "heiratet", sie: "heiraten" },
    { inf: "spielen", en: "to play", aux: "haben", pp: "gespielt", pret: "spielte", irreg: false, ich: "spiele", du: "spielst", er: "spielt", wir: "spielen", ihr: "spielt", sie: "spielen" },
    { inf: "erzählen", en: "to tell", aux: "haben", pp: "erzählt", pret: "erzählte", irreg: false, ich: "erzähle", du: "erzählst", er: "erzählt", wir: "erzählen", ihr: "erzählt", sie: "erzählen" },
    { inf: "helfen", en: "to help", aux: "haben", pp: "geholfen", pret: "half", irreg: true, ich: "helfe", du: "hilfst", er: "hilft", wir: "helfen", ihr: "helft", sie: "helfen" },
    { inf: "treffen", en: "to meet", aux: "haben", pp: "getroffen", pret: "traf", irreg: true, ich: "treffe", du: "triffst", er: "trifft", wir: "treffen", ihr: "trefft", sie: "treffen" },
    { inf: "einladen", en: "to invite", aux: "haben", pp: "eingeladen", pret: "lud ein", irreg: true, ich: "lade ein", du: "lädst ein", er: "lädt ein", wir: "laden ein", ihr: "ladet ein", sie: "laden ein" },
    { inf: "verstehen", en: "to understand", aux: "haben", pp: "verstanden", pret: "verstand", irreg: true, ich: "verstehe", du: "verstehst", er: "versteht", wir: "verstehen", ihr: "versteht", sie: "verstehen" },
    { inf: "streiten", en: "to argue", aux: "haben", pp: "gestritten", pret: "stritt", irreg: true, ich: "streite", du: "streitest", er: "streitet", wir: "streiten", ihr: "streitet", sie: "streiten" },
  ],
  "wohnen": [
    { inf: "mieten", en: "to rent", aux: "haben", pp: "gemietet", pret: "mietete", irreg: false, ich: "miete", du: "mietest", er: "mietet", wir: "mieten", ihr: "mietet", sie: "mieten" },
    { inf: "umziehen", en: "to move", aux: "sein", pp: "umgezogen", pret: "zog um", irreg: true, ich: "ziehe um", du: "ziehst um", er: "zieht um", wir: "ziehen um", ihr: "zieht um", sie: "ziehen um" },
    { inf: "putzen", en: "to clean", aux: "haben", pp: "geputzt", pret: "putzte", irreg: false, ich: "putze", du: "putzt", er: "putzt", wir: "putzen", ihr: "putzt", sie: "putzen" },
    { inf: "kochen", en: "to cook", aux: "haben", pp: "gekocht", pret: "kochte", irreg: false, ich: "koche", du: "kochst", er: "kocht", wir: "kochen", ihr: "kocht", sie: "kochen" },
    { inf: "schlafen", en: "to sleep", aux: "haben", pp: "geschlafen", pret: "schlief", irreg: true, ich: "schlafe", du: "schläfst", er: "schläft", wir: "schlafen", ihr: "schlaft", sie: "schlafen" },
    { inf: "aufräumen", en: "to tidy up", aux: "haben", pp: "aufgeräumt", pret: "räumte auf", irreg: false, ich: "räume auf", du: "räumst auf", er: "räumt auf", wir: "räumen auf", ihr: "räumt auf", sie: "räumen auf" },
    { inf: "einrichten", en: "to furnish", aux: "haben", pp: "eingerichtet", pret: "richtete ein", irreg: false, ich: "richte ein", du: "richtest ein", er: "richtet ein", wir: "richten ein", ihr: "richtet ein", sie: "richten ein" },
    { inf: "renovieren", en: "to renovate", aux: "haben", pp: "renoviert", pret: "renovierte", irreg: false, ich: "renoviere", du: "renovierst", er: "renoviert", wir: "renovieren", ihr: "renoviert", sie: "renovieren" },
    { inf: "öffnen", en: "to open", aux: "haben", pp: "geöffnet", pret: "öffnete", irreg: false, ich: "öffne", du: "öffnest", er: "öffnet", wir: "öffnen", ihr: "öffnet", sie: "öffnen" },
    { inf: "schließen", en: "to close", aux: "haben", pp: "geschlossen", pret: "schloss", irreg: true, ich: "schließe", du: "schließt", er: "schließt", wir: "schließen", ihr: "schließt", sie: "schließen" },
  ],
  "essen-und-trinken": [
    { inf: "essen", en: "to eat", aux: "haben", pp: "gegessen", pret: "aß", irreg: true, ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen" },
    { inf: "trinken", en: "to drink", aux: "haben", pp: "getrunken", pret: "trank", irreg: true, ich: "trinke", du: "trinkst", er: "trinkt", wir: "trinken", ihr: "trinkt", sie: "trinken" },
    { inf: "bestellen", en: "to order", aux: "haben", pp: "bestellt", pret: "bestellte", irreg: false, ich: "bestelle", du: "bestellst", er: "bestellt", wir: "bestellen", ihr: "bestellt", sie: "bestellen" },
    { inf: "schmecken", en: "to taste", aux: "haben", pp: "geschmeckt", pret: "schmeckte", irreg: false, ich: "schmecke", du: "schmeckst", er: "schmeckt", wir: "schmecken", ihr: "schmeckt", sie: "schmecken" },
    { inf: "backen", en: "to bake", aux: "haben", pp: "gebacken", pret: "backte", irreg: true, ich: "backe", du: "bäckst", er: "bäckt", wir: "backen", ihr: "backt", sie: "backen" },
    { inf: "schneiden", en: "to cut", aux: "haben", pp: "geschnitten", pret: "schnitt", irreg: true, ich: "schneide", du: "schneidest", er: "schneidet", wir: "schneiden", ihr: "schneidet", sie: "schneiden" },
    { inf: "nehmen", en: "to take", aux: "haben", pp: "genommen", pret: "nahm", irreg: true, ich: "nehme", du: "nimmst", er: "nimmt", wir: "nehmen", ihr: "nehmt", sie: "nehmen" },
    { inf: "brauchen", en: "to need", aux: "haben", pp: "gebraucht", pret: "brauchte", irreg: false, ich: "brauche", du: "brauchst", er: "braucht", wir: "brauchen", ihr: "braucht", sie: "brauchen" },
    { inf: "mögen", en: "to like", aux: "haben", pp: "gemocht", pret: "mochte", irreg: true, ich: "mag", du: "magst", er: "mag", wir: "mögen", ihr: "mögt", sie: "mögen" },
    { inf: "probieren", en: "to try/taste", aux: "haben", pp: "probiert", pret: "probierte", irreg: false, ich: "probiere", du: "probierst", er: "probiert", wir: "probieren", ihr: "probiert", sie: "probieren" },
  ],
  "einkaufen": [
    { inf: "kaufen", en: "to buy", aux: "haben", pp: "gekauft", pret: "kaufte", irreg: false, ich: "kaufe", du: "kaufst", er: "kauft", wir: "kaufen", ihr: "kauft", sie: "kaufen" },
    { inf: "verkaufen", en: "to sell", aux: "haben", pp: "verkauft", pret: "verkaufte", irreg: false, ich: "verkaufe", du: "verkaufst", er: "verkauft", wir: "verkaufen", ihr: "verkauft", sie: "verkaufen" },
    { inf: "bezahlen", en: "to pay", aux: "haben", pp: "bezahlt", pret: "bezahlte", irreg: false, ich: "bezahle", du: "bezahlst", er: "bezahlt", wir: "bezahlen", ihr: "bezahlt", sie: "bezahlen" },
    { inf: "kosten", en: "to cost", aux: "haben", pp: "gekostet", pret: "kostete", irreg: false, ich: "koste", du: "kostest", er: "kostet", wir: "kosten", ihr: "kostet", sie: "kosten" },
    { inf: "suchen", en: "to search", aux: "haben", pp: "gesucht", pret: "suchte", irreg: false, ich: "suche", du: "suchst", er: "sucht", wir: "suchen", ihr: "sucht", sie: "suchen" },
    { inf: "finden", en: "to find", aux: "haben", pp: "gefunden", pret: "fand", irreg: true, ich: "finde", du: "findest", er: "findet", wir: "finden", ihr: "findet", sie: "finden" },
    { inf: "tragen", en: "to wear/carry", aux: "haben", pp: "getragen", pret: "trug", irreg: true, ich: "trage", du: "trägst", er: "trägt", wir: "tragen", ihr: "tragt", sie: "tragen" },
    { inf: "anprobieren", en: "to try on", aux: "haben", pp: "anprobiert", pret: "probierte an", irreg: false, ich: "probiere an", du: "probierst an", er: "probiert an", wir: "probieren an", ihr: "probiert an", sie: "probieren an" },
    { inf: "umtauschen", en: "to exchange", aux: "haben", pp: "umgetauscht", pret: "tauschte um", irreg: false, ich: "tausche um", du: "tauschst um", er: "tauscht um", wir: "tauschen um", ihr: "tauscht um", sie: "tauschen um" },
    { inf: "sparen", en: "to save", aux: "haben", pp: "gespart", pret: "sparte", irreg: false, ich: "spare", du: "sparst", er: "spart", wir: "sparen", ihr: "spart", sie: "sparen" },
  ],
  "gesundheit": [
    { inf: "fühlen", en: "to feel", aux: "haben", pp: "gefühlt", pret: "fühlte", irreg: false, ich: "fühle", du: "fühlst", er: "fühlt", wir: "fühlen", ihr: "fühlt", sie: "fühlen" },
    { inf: "untersuchen", en: "to examine", aux: "haben", pp: "untersucht", pret: "untersuchte", irreg: false, ich: "untersuche", du: "untersuchst", er: "untersucht", wir: "untersuchen", ihr: "untersucht", sie: "untersuchen" },
    { inf: "verschreiben", en: "to prescribe", aux: "haben", pp: "verschrieben", pret: "verschrieb", irreg: true, ich: "verschreibe", du: "verschreibst", er: "verschreibt", wir: "verschreiben", ihr: "verschreibt", sie: "verschreiben" },
    { inf: "husten", en: "to cough", aux: "haben", pp: "gehustet", pret: "hustete", irreg: false, ich: "huste", du: "hustest", er: "hustet", wir: "husten", ihr: "hustet", sie: "husten" },
    { inf: "wehtun", en: "to hurt", aux: "haben", pp: "wehgetan", pret: "tat weh", irreg: true, ich: "tue weh", du: "tust weh", er: "tut weh", wir: "tun weh", ihr: "tut weh", sie: "tun weh" },
    { inf: "erholen", en: "to recover", aux: "haben", pp: "erholt", pret: "erholte", irreg: false, ich: "erhole", du: "erholst", er: "erholt", wir: "erholen", ihr: "erholt", sie: "erholen" },
    { inf: "rauchen", en: "to smoke", aux: "haben", pp: "geraucht", pret: "rauchte", irreg: false, ich: "rauche", du: "rauchst", er: "raucht", wir: "rauchen", ihr: "raucht", sie: "rauchen" },
    { inf: "abnehmen", en: "to lose weight", aux: "haben", pp: "abgenommen", pret: "nahm ab", irreg: true, ich: "nehme ab", du: "nimmst ab", er: "nimmt ab", wir: "nehmen ab", ihr: "nehmt ab", sie: "nehmen ab" },
    { inf: "operieren", en: "to operate", aux: "haben", pp: "operiert", pret: "operierte", irreg: false, ich: "operiere", du: "operierst", er: "operiert", wir: "operieren", ihr: "operiert", sie: "operieren" },
    { inf: "impfen", en: "to vaccinate", aux: "haben", pp: "geimpft", pret: "impfte", irreg: false, ich: "impfe", du: "impfst", er: "impft", wir: "impfen", ihr: "impft", sie: "impfen" },
  ],
  "arbeit-und-beruf": [
    { inf: "arbeiten", en: "to work", aux: "haben", pp: "gearbeitet", pret: "arbeitete", irreg: false, ich: "arbeite", du: "arbeitest", er: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie: "arbeiten" },
    { inf: "verdienen", en: "to earn", aux: "haben", pp: "verdient", pret: "verdiente", irreg: false, ich: "verdiene", du: "verdienst", er: "verdient", wir: "verdienen", ihr: "verdient", sie: "verdienen" },
    { inf: "bewerben", en: "to apply", aux: "haben", pp: "beworben", pret: "bewarb", irreg: true, ich: "bewerbe", du: "bewirbst", er: "bewirbt", wir: "bewerben", ihr: "bewerbt", sie: "bewerben" },
    { inf: "kündigen", en: "to quit", aux: "haben", pp: "gekündigt", pret: "kündigte", irreg: false, ich: "kündige", du: "kündigst", er: "kündigt", wir: "kündigen", ihr: "kündigt", sie: "kündigen" },
    { inf: "leiten", en: "to lead", aux: "haben", pp: "geleitet", pret: "leitete", irreg: false, ich: "leite", du: "leitest", er: "leitet", wir: "leiten", ihr: "leitet", sie: "leiten" },
    { inf: "erledigen", en: "to complete", aux: "haben", pp: "erledigt", pret: "erledigte", irreg: false, ich: "erledige", du: "erledigst", er: "erledigt", wir: "erledigen", ihr: "erledigt", sie: "erledigen" },
    { inf: "telefonieren", en: "to phone", aux: "haben", pp: "telefoniert", pret: "telefonierte", irreg: false, ich: "telefoniere", du: "telefonierst", er: "telefoniert", wir: "telefonieren", ihr: "telefoniert", sie: "telefonieren" },
    { inf: "vorstellen", en: "to introduce", aux: "haben", pp: "vorgestellt", pret: "stellte vor", irreg: false, ich: "stelle vor", du: "stellst vor", er: "stellt vor", wir: "stellen vor", ihr: "stellt vor", sie: "stellen vor" },
    { inf: "unterschreiben", en: "to sign", aux: "haben", pp: "unterschrieben", pret: "unterschrieb", irreg: true, ich: "unterschreibe", du: "unterschreibst", er: "unterschreibt", wir: "unterschreiben", ihr: "unterschreibt", sie: "unterschreiben" },
    { inf: "vereinbaren", en: "to arrange", aux: "haben", pp: "vereinbart", pret: "vereinbarte", irreg: false, ich: "vereinbare", du: "vereinbarst", er: "vereinbart", wir: "vereinbaren", ihr: "vereinbart", sie: "vereinbaren" },
  ],
  "schule-und-bildung": [
    { inf: "studieren", en: "to study", aux: "haben", pp: "studiert", pret: "studierte", irreg: false, ich: "studiere", du: "studierst", er: "studiert", wir: "studieren", ihr: "studiert", sie: "studieren" },
    { inf: "lesen", en: "to read", aux: "haben", pp: "gelesen", pret: "las", irreg: true, ich: "lese", du: "liest", er: "liest", wir: "lesen", ihr: "lest", sie: "lesen" },
    { inf: "schreiben", en: "to write", aux: "haben", pp: "geschrieben", pret: "schrieb", irreg: true, ich: "schreibe", du: "schreibst", er: "schreibt", wir: "schreiben", ihr: "schreibt", sie: "schreiben" },
    { inf: "üben", en: "to practice", aux: "haben", pp: "geübt", pret: "übte", irreg: false, ich: "übe", du: "übst", er: "übt", wir: "üben", ihr: "übt", sie: "üben" },
    { inf: "erklären", en: "to explain", aux: "haben", pp: "erklärt", pret: "erklärte", irreg: false, ich: "erkläre", du: "erklärst", er: "erklärt", wir: "erklären", ihr: "erklärt", sie: "erklären" },
    { inf: "bestehen", en: "to pass (exam)", aux: "haben", pp: "bestanden", pret: "bestand", irreg: true, ich: "bestehe", du: "bestehst", er: "besteht", wir: "bestehen", ihr: "besteht", sie: "bestehen" },
    { inf: "wiederholen", en: "to repeat", aux: "haben", pp: "wiederholt", pret: "wiederholte", irreg: false, ich: "wiederhole", du: "wiederholst", er: "wiederholt", wir: "wiederholen", ihr: "wiederholt", sie: "wiederholen" },
    { inf: "unterrichten", en: "to teach", aux: "haben", pp: "unterrichtet", pret: "unterrichtete", irreg: false, ich: "unterrichte", du: "unterrichtest", er: "unterrichtet", wir: "unterrichten", ihr: "unterrichtet", sie: "unterrichten" },
    { inf: "vorbereiten", en: "to prepare", aux: "haben", pp: "vorbereitet", pret: "bereitete vor", irreg: false, ich: "bereite vor", du: "bereitest vor", er: "bereitet vor", wir: "bereiten vor", ihr: "bereitet vor", sie: "bereiten vor" },
    { inf: "merken", en: "to remember", aux: "haben", pp: "gemerkt", pret: "merkte", irreg: false, ich: "merke", du: "merkst", er: "merkt", wir: "merken", ihr: "merkt", sie: "merken" },
  ],
  "freizeit": [
    { inf: "schwimmen", en: "to swim", aux: "sein", pp: "geschwommen", pret: "schwamm", irreg: true, ich: "schwimme", du: "schwimmst", er: "schwimmt", wir: "schwimmen", ihr: "schwimmt", sie: "schwimmen" },
    { inf: "laufen", en: "to run", aux: "sein", pp: "gelaufen", pret: "lief", irreg: true, ich: "laufe", du: "läufst", er: "läuft", wir: "laufen", ihr: "lauft", sie: "laufen" },
    { inf: "singen", en: "to sing", aux: "haben", pp: "gesungen", pret: "sang", irreg: true, ich: "singe", du: "singst", er: "singt", wir: "singen", ihr: "singt", sie: "singen" },
    { inf: "tanzen", en: "to dance", aux: "haben", pp: "getanzt", pret: "tanzte", irreg: false, ich: "tanze", du: "tanzt", er: "tanzt", wir: "tanzen", ihr: "tanzt", sie: "tanzen" },
    { inf: "wandern", en: "to hike", aux: "sein", pp: "gewandert", pret: "wanderte", irreg: false, ich: "wandere", du: "wanderst", er: "wandert", wir: "wandern", ihr: "wandert", sie: "wandern" },
    { inf: "fotografieren", en: "to photograph", aux: "haben", pp: "fotografiert", pret: "fotografierte", irreg: false, ich: "fotografiere", du: "fotografierst", er: "fotografiert", wir: "fotografieren", ihr: "fotografiert", sie: "fotografieren" },
    { inf: "malen", en: "to paint", aux: "haben", pp: "gemalt", pret: "malte", irreg: false, ich: "male", du: "malst", er: "malt", wir: "malen", ihr: "malt", sie: "malen" },
    { inf: "fernsehen", en: "to watch TV", aux: "haben", pp: "ferngesehen", pret: "sah fern", irreg: true, ich: "sehe fern", du: "siehst fern", er: "sieht fern", wir: "sehen fern", ihr: "seht fern", sie: "sehen fern" },
    { inf: "entspannen", en: "to relax", aux: "haben", pp: "entspannt", pret: "entspannte", irreg: false, ich: "entspanne", du: "entspannst", er: "entspannt", wir: "entspannen", ihr: "entspannt", sie: "entspannen" },
    { inf: "genießen", en: "to enjoy", aux: "haben", pp: "genossen", pret: "genoss", irreg: true, ich: "genieße", du: "genießt", er: "genießt", wir: "genießen", ihr: "genießt", sie: "genießen" },
  ],
  "reisen": [
    { inf: "reisen", en: "to travel", aux: "sein", pp: "gereist", pret: "reiste", irreg: false, ich: "reise", du: "reist", er: "reist", wir: "reisen", ihr: "reist", sie: "reisen" },
    { inf: "fliegen", en: "to fly", aux: "sein", pp: "geflogen", pret: "flog", irreg: true, ich: "fliege", du: "fliegst", er: "fliegt", wir: "fliegen", ihr: "fliegt", sie: "fliegen" },
    { inf: "fahren", en: "to drive", aux: "sein", pp: "gefahren", pret: "fuhr", irreg: true, ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren" },
    { inf: "buchen", en: "to book", aux: "haben", pp: "gebucht", pret: "buchte", irreg: false, ich: "buche", du: "buchst", er: "bucht", wir: "buchen", ihr: "bucht", sie: "buchen" },
    { inf: "packen", en: "to pack", aux: "haben", pp: "gepackt", pret: "packte", irreg: false, ich: "packe", du: "packst", er: "packt", wir: "packen", ihr: "packt", sie: "packen" },
    { inf: "ankommen", en: "to arrive", aux: "sein", pp: "angekommen", pret: "kam an", irreg: true, ich: "komme an", du: "kommst an", er: "kommt an", wir: "kommen an", ihr: "kommt an", sie: "kommen an" },
    { inf: "abfahren", en: "to depart", aux: "sein", pp: "abgefahren", pret: "fuhr ab", irreg: true, ich: "fahre ab", du: "fährst ab", er: "fährt ab", wir: "fahren ab", ihr: "fahrt ab", sie: "fahren ab" },
    { inf: "übernachten", en: "to stay overnight", aux: "haben", pp: "übernachtet", pret: "übernachtete", irreg: false, ich: "übernachte", du: "übernachtest", er: "übernachtet", wir: "übernachten", ihr: "übernachtet", sie: "übernachten" },
    { inf: "besichtigen", en: "to visit/tour", aux: "haben", pp: "besichtigt", pret: "besichtigte", irreg: false, ich: "besichtige", du: "besichtigst", er: "besichtigt", wir: "besichtigen", ihr: "besichtigt", sie: "besichtigen" },
    { inf: "umsteigen", en: "to transfer", aux: "sein", pp: "umgestiegen", pret: "stieg um", irreg: true, ich: "steige um", du: "steigst um", er: "steigt um", wir: "steigen um", ihr: "steigt um", sie: "steigen um" },
  ],
  "verkehr": [
    { inf: "fahren", en: "to drive", aux: "sein", pp: "gefahren", pret: "fuhr", irreg: true, ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren" },
    { inf: "parken", en: "to park", aux: "haben", pp: "geparkt", pret: "parkte", irreg: false, ich: "parke", du: "parkst", er: "parkt", wir: "parken", ihr: "parkt", sie: "parken" },
    { inf: "tanken", en: "to refuel", aux: "haben", pp: "getankt", pret: "tankte", irreg: false, ich: "tanke", du: "tankst", er: "tankt", wir: "tanken", ihr: "tankt", sie: "tanken" },
    { inf: "bremsen", en: "to brake", aux: "haben", pp: "gebremst", pret: "bremste", irreg: false, ich: "bremse", du: "bremst", er: "bremst", wir: "bremsen", ihr: "bremst", sie: "bremsen" },
    { inf: "abbiegen", en: "to turn", aux: "sein", pp: "abgebogen", pret: "bog ab", irreg: true, ich: "biege ab", du: "biegst ab", er: "biegt ab", wir: "biegen ab", ihr: "biegt ab", sie: "biegen ab" },
    { inf: "einsteigen", en: "to board", aux: "sein", pp: "eingestiegen", pret: "stieg ein", irreg: true, ich: "steige ein", du: "steigst ein", er: "steigt ein", wir: "steigen ein", ihr: "steigt ein", sie: "steigen ein" },
    { inf: "aussteigen", en: "to get off", aux: "sein", pp: "ausgestiegen", pret: "stieg aus", irreg: true, ich: "steige aus", du: "steigst aus", er: "steigt aus", wir: "steigen aus", ihr: "steigt aus", sie: "steigen aus" },
    { inf: "halten", en: "to stop", aux: "haben", pp: "gehalten", pret: "hielt", irreg: true, ich: "halte", du: "hältst", er: "hält", wir: "halten", ihr: "haltet", sie: "halten" },
    { inf: "überqueren", en: "to cross", aux: "haben", pp: "überquert", pret: "überquerte", irreg: false, ich: "überquere", du: "überquerst", er: "überquert", wir: "überqueren", ihr: "überquert", sie: "überqueren" },
    { inf: "warten", en: "to wait", aux: "haben", pp: "gewartet", pret: "wartete", irreg: false, ich: "warte", du: "wartest", er: "wartet", wir: "warten", ihr: "wartet", sie: "warten" },
  ],
};

async function main() {
  console.log("Seeding 30 chapters with 20 words each...");

  for (const ch of chapters) {
    const chapter = await prisma.chapter.upsert({
      where: { slug: ch.slug },
      update: { titleDe: ch.de, titleEn: ch.en, dayNumber: ch.day },
      create: { slug: ch.slug, titleDe: ch.de, titleEn: ch.en, dayNumber: ch.day },
    });

    for (const w of ch.words) {
      const existing = await prisma.word.findFirst({
        where: { german: w.de, chapterId: chapter.id },
      });
      if (!existing) {
        await prisma.word.create({
          data: {
            german: w.de,
            english: w.en,
            article: w.art,
            chapterId: chapter.id,
          },
        });
      }
    }

    const verbs = chapterVerbs[ch.slug];
    if (verbs) {
      for (const v of verbs) {
        const existing = await prisma.verb.findFirst({
          where: { infinitive: v.inf, chapterId: chapter.id },
        });
        if (!existing) {
          await prisma.verb.create({
            data: {
              infinitive: v.inf, english: v.en, auxiliary: v.aux,
              partizipII: v.pp, praeteritum: v.pret, isIrregular: v.irreg,
              ichPraesens: v.ich, duPraesens: v.du, erPraesens: v.er,
              wirPraesens: v.wir, ihrPraesens: v.ihr, siePraesens: v.sie,
              chapterId: chapter.id,
            },
          });
        }
      }
      console.log(`  Day ${ch.day}: ${ch.en} (${ch.words.length} words, ${verbs.length} verbs)`);
    } else {
      console.log(`  Day ${ch.day}: ${ch.en} (${ch.words.length} words)`);
    }
  }

  // Seed grammar rules and exercises
  console.log("\nSeeding grammar rules and exercises...");
  const grammarData: Record<string, { titleDe: string; titleEn: string; formula: string; explDe: string; explEn: string; ex1De: string; ex1En: string; ex2De: string; ex2En: string; exercises: { type: string; promptDe: string; promptEn: string | null; answer: string; hint: string | null }[] }[]> = {
    "sich-vorstellen": [{
      titleDe: "Verben im Präsens", titleEn: "Present Tense Verbs",
      formula: "Subjekt + Verb (konjugiert) + Rest",
      explDe: "Im Deutschen steht das konjugierte Verb immer an zweiter Stelle im Hauptsatz.",
      explEn: "In German, the conjugated verb always goes in the second position of the main clause.",
      ex1De: "Ich komme aus Indien.", ex1En: "I come from India.",
      ex2De: "Er arbeitet bei Siemens.", ex2En: "He works at Siemens.",
      exercises: [
        { type: "fill_in", promptDe: "Ich ___ aus Deutschland. (kommen)", promptEn: "I come from Germany.", answer: "komme", hint: "ich + kommen = ?" },
        { type: "fill_in", promptDe: "Er ___ Deutsch. (sprechen)", promptEn: "He speaks German.", answer: "spricht", hint: "er + sprechen = ?" },
        { type: "fill_in", promptDe: "Wir ___ in Berlin. (wohnen)", promptEn: "We live in Berlin.", answer: "wohnen", hint: "wir + wohnen = ?" },
        { type: "write", promptDe: "Schreiben Sie: 'Ich heiße Maria.'", promptEn: "Write: I am called Maria.", answer: "Ich heiße Maria.", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Sie arbeitet als Lehrerin.'", promptEn: "Write: She works as a teacher.", answer: "Sie arbeitet als Lehrerin.", hint: null },
      ],
    }],
    "familie-und-freunde": [{
      titleDe: "Possessivpronomen", titleEn: "Possessive Pronouns",
      formula: "Possessivpronomen + Nomen",
      explDe: "Possessivpronomen zeigen Besitz an: mein, dein, sein, ihr, unser, euer, ihr.",
      explEn: "Possessive pronouns show ownership: my, your, his, her, our, your (pl.), their.",
      ex1De: "Mein Bruder heißt Thomas.", ex1En: "My brother is called Thomas.",
      ex2De: "Ihre Schwester wohnt in München.", ex2En: "Her sister lives in Munich.",
      exercises: [
        { type: "fill_in", promptDe: "___ Mutter ist Ärztin. (ich)", promptEn: "My mother is a doctor.", answer: "Meine", hint: "ich → mein/meine" },
        { type: "fill_in", promptDe: "___ Vater arbeitet viel. (er)", promptEn: "His father works a lot.", answer: "Sein", hint: "er → sein" },
        { type: "fill_in", promptDe: "___ Kinder gehen zur Schule. (wir)", promptEn: "Our children go to school.", answer: "Unsere", hint: "wir → unser/unsere" },
        { type: "write", promptDe: "Schreiben Sie: 'Mein Freund kommt aus der Türkei.'", promptEn: null, answer: "Mein Freund kommt aus der Türkei.", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Ihre Familie ist sehr groß.'", promptEn: null, answer: "Ihre Familie ist sehr groß.", hint: null },
      ],
    }],
    "wohnen": [{
      titleDe: "Akkusativ mit bestimmtem Artikel", titleEn: "Accusative with Definite Article",
      formula: "der → den | die → die | das → das",
      explDe: "Im Akkusativ ändert sich nur der maskuline Artikel: der wird zu den.",
      explEn: "In the accusative case, only the masculine article changes: der becomes den.",
      ex1De: "Ich sehe den Tisch.", ex1En: "I see the table.",
      ex2De: "Sie kauft die Lampe.", ex2En: "She buys the lamp.",
      exercises: [
        { type: "fill_in", promptDe: "Ich kaufe ___ Schrank. (der)", promptEn: "I buy the closet.", answer: "den", hint: "der → den (Akkusativ)" },
        { type: "fill_in", promptDe: "Er öffnet ___ Fenster. (das)", promptEn: "He opens the window.", answer: "das", hint: "das bleibt das" },
        { type: "fill_in", promptDe: "Wir brauchen ___ Tür. (die)", promptEn: "We need the door.", answer: "die", hint: "die bleibt die" },
        { type: "write", promptDe: "Schreiben Sie: 'Ich sehe den Balkon.'", promptEn: null, answer: "Ich sehe den Balkon.", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Sie hat das Zimmer.'", promptEn: null, answer: "Sie hat das Zimmer.", hint: null },
      ],
    }],
    "essen-und-trinken": [{
      titleDe: "Modalverben: möchten", titleEn: "Modal Verbs: would like",
      formula: "Subjekt + möchte(n) + ... + Infinitiv",
      explDe: "Möchten drückt einen Wunsch aus. Das zweite Verb steht am Satzende im Infinitiv.",
      explEn: "'Möchten' expresses a wish. The second verb goes at the end in infinitive form.",
      ex1De: "Ich möchte einen Kaffee trinken.", ex1En: "I would like to drink a coffee.",
      ex2De: "Er möchte Kuchen bestellen.", ex2En: "He would like to order cake.",
      exercises: [
        { type: "fill_in", promptDe: "Ich ___ ein Wasser trinken. (möchten)", promptEn: null, answer: "möchte", hint: "ich → möchte" },
        { type: "fill_in", promptDe: "Wir ___ Suppe bestellen. (möchten)", promptEn: null, answer: "möchten", hint: "wir → möchten" },
        { type: "fill_in", promptDe: "Er ___ Reis essen. (möchten)", promptEn: null, answer: "möchte", hint: "er → möchte" },
        { type: "write", promptDe: "Schreiben Sie: 'Ich möchte einen Tee trinken.'", promptEn: null, answer: "Ich möchte einen Tee trinken.", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Sie möchte Salat bestellen.'", promptEn: null, answer: "Sie möchte Salat bestellen.", hint: null },
      ],
    }],
    "einkaufen": [{
      titleDe: "Komparativ und Superlativ", titleEn: "Comparative and Superlative",
      formula: "Adj + -er (Komparativ) | am + Adj + -sten (Superlativ)",
      explDe: "Zum Vergleichen: billig → billiger → am billigsten. Einsilbige Adjektive bekommen oft einen Umlaut.",
      explEn: "For comparing: cheap → cheaper → cheapest. One-syllable adjectives often get an umlaut.",
      ex1De: "Das Hemd ist billiger als die Jacke.", ex1En: "The shirt is cheaper than the jacket.",
      ex2De: "Die Schuhe sind am teuersten.", ex2En: "The shoes are the most expensive.",
      exercises: [
        { type: "fill_in", promptDe: "Das Kleid ist ___ als die Hose. (teuer)", promptEn: null, answer: "teurer", hint: "teuer → teurer" },
        { type: "fill_in", promptDe: "Der Markt ist am ___. (billig)", promptEn: null, answer: "billigsten", hint: "billig → am billigsten" },
        { type: "fill_in", promptDe: "Diese Tasche ist ___ als jene. (groß)", promptEn: null, answer: "größer", hint: "groß → größer" },
        { type: "write", promptDe: "Schreiben Sie: 'Das Hemd ist billiger als die Jacke.'", promptEn: null, answer: "Das Hemd ist billiger als die Jacke.", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Die Schuhe sind am teuersten.'", promptEn: null, answer: "Die Schuhe sind am teuersten.", hint: null },
      ],
    }],
    "gesundheit": [{
      titleDe: "Imperativ", titleEn: "Imperative",
      formula: "du: Stamm(+e) | ihr: Stamm+t | Sie: Verb+en Sie",
      explDe: "Der Imperativ gibt Anweisungen. Bei 'du' fällt das Pronomen weg.",
      explEn: "The imperative gives commands. With 'du', the pronoun is dropped.",
      ex1De: "Nehmen Sie die Tabletten!", ex1En: "Take the tablets!",
      ex2De: "Trink viel Wasser!", ex2En: "Drink lots of water!",
      exercises: [
        { type: "fill_in", promptDe: "___ Sie bitte Platz! (nehmen)", promptEn: null, answer: "Nehmen", hint: "Sie-Form: Verb + Sie" },
        { type: "fill_in", promptDe: "___ zum Arzt! (gehen, du)", promptEn: null, answer: "Geh", hint: "du-Form: Stamm" },
        { type: "fill_in", promptDe: "___ Sie die Medizin! (nehmen)", promptEn: null, answer: "Nehmen", hint: "Sie-Form" },
        { type: "write", promptDe: "Schreiben Sie: 'Trinken Sie viel Wasser!'", promptEn: null, answer: "Trinken Sie viel Wasser!", hint: null },
        { type: "write", promptDe: "Schreiben Sie: 'Ruf den Arzt an!'", promptEn: null, answer: "Ruf den Arzt an!", hint: null },
      ],
    }],
  };

  let totalRules = 0;
  let totalExercises = 0;

  for (const ch of chapters) {
    const chapter = await prisma.chapter.findUnique({ where: { slug: ch.slug } });
    if (!chapter) continue;

    const rules = grammarData[ch.slug];
    if (!rules) continue;

    for (const rule of rules) {
      const existing = await prisma.grammarRule.findFirst({
        where: { titleDe: rule.titleDe, chapterId: chapter.id },
      });
      if (existing) continue;

      const created = await prisma.grammarRule.create({
        data: {
          titleDe: rule.titleDe, titleEn: rule.titleEn, formula: rule.formula,
          explanationDe: rule.explDe, explanationEn: rule.explEn,
          example1De: rule.ex1De, example1En: rule.ex1En,
          example2De: rule.ex2De, example2En: rule.ex2En,
          chapterId: chapter.id,
        },
      });
      totalRules++;

      for (const ex of rule.exercises) {
        await prisma.sentenceExercise.create({
          data: {
            type: ex.type, promptDe: ex.promptDe, promptEn: ex.promptEn,
            answer: ex.answer, hint: ex.hint, grammarRuleId: created.id,
          },
        });
        totalExercises++;
      }
    }
  }

  console.log(`  Grammar: ${totalRules} rules, ${totalExercises} exercises`);

  // Seed reading passages
  console.log("\nSeeding reading passages...");
  const readingData: Record<string, { titleDe: string; titleEn: string; content: string; time: number; questions: { question: string; options: string[]; correctIndex: number }[] }[]> = {
    "sich-vorstellen": [{
      titleDe: "Neue Nachbarin", titleEn: "New Neighbor",
      content: "Hallo, ich bin Maria. Ich komme aus Spanien, aber ich lebe seit zwei Jahren in Berlin. Ich bin 28 Jahre alt und arbeite als Grafikdesignerin bei einer kleinen Agentur. In meiner Freizeit male ich gern und gehe oft ins Museum. Ich spreche Spanisch, Englisch und ein bisschen Deutsch. Ich lerne Deutsch seit einem Jahr an der Volkshochschule. Mein Ziel ist die telc B1 Prüfung.",
      time: 180,
      questions: [
        { question: "Woher kommt Maria?", options: ["Deutschland", "Spanien", "Italien"], correctIndex: 1 },
        { question: "Was ist Marias Beruf?", options: ["Lehrerin", "Ärztin", "Grafikdesignerin"], correctIndex: 2 },
        { question: "Wie lange lernt Maria Deutsch?", options: ["Zwei Jahre", "Ein Jahr", "Sechs Monate"], correctIndex: 1 },
      ],
    }],
    "wohnen": [{
      titleDe: "Wohnungsanzeige", titleEn: "Apartment Ad",
      content: "Schöne 3-Zimmer-Wohnung in Berlin-Kreuzberg zu vermieten. Die Wohnung hat 75 Quadratmeter und liegt im 3. Stock mit Aufzug. Sie hat ein großes Wohnzimmer, zwei Schlafzimmer, eine moderne Küche und ein Badezimmer mit Badewanne. Es gibt auch einen Balkon mit Blick auf den Hof. Die Kaltmiete beträgt 850 Euro plus 200 Euro Nebenkosten. Die Wohnung ist ab dem 1. August verfügbar. Haustiere sind nicht erlaubt.",
      time: 180,
      questions: [
        { question: "Wie groß ist die Wohnung?", options: ["65 qm", "75 qm", "85 qm"], correctIndex: 1 },
        { question: "In welchem Stock ist die Wohnung?", options: ["2. Stock", "3. Stock", "4. Stock"], correctIndex: 1 },
        { question: "Wie hoch ist die Warmmiete?", options: ["850 Euro", "1050 Euro", "1200 Euro"], correctIndex: 1 },
        { question: "Sind Haustiere erlaubt?", options: ["Ja", "Nein", "Nur Katzen"], correctIndex: 1 },
      ],
    }],
    "gesundheit": [{
      titleDe: "Beim Arzt", titleEn: "At the Doctor",
      content: "Frau Müller geht zum Arzt, weil sie seit drei Tagen Kopfschmerzen und Fieber hat. Der Arzt untersucht sie und sagt, dass sie eine starke Erkältung hat. Er verschreibt ihr Medikamente: Tabletten gegen die Kopfschmerzen und einen Hustensaft. Er empfiehlt ihr, viel Wasser zu trinken und drei Tage im Bett zu bleiben. Frau Müller bekommt auch eine Krankschreibung für ihre Arbeit.",
      time: 180,
      questions: [
        { question: "Warum geht Frau Müller zum Arzt?", options: ["Bauchschmerzen", "Kopfschmerzen und Fieber", "Rückenschmerzen"], correctIndex: 1 },
        { question: "Was hat Frau Müller?", options: ["Grippe", "Allergie", "Erkältung"], correctIndex: 2 },
        { question: "Wie lange soll sie im Bett bleiben?", options: ["Zwei Tage", "Drei Tage", "Eine Woche"], correctIndex: 1 },
      ],
    }],
    "einkaufen": [{
      titleDe: "Sonderangebot", titleEn: "Special Offer",
      content: "Diese Woche gibt es tolle Sonderangebote im Kaufhaus Müller! Alle Winterjacken sind 40% reduziert. Ein Paar Sportschuhe kostet nur 49,99 Euro statt 89,99 Euro. Kinderbekleidung gibt es ab 9,99 Euro. Außerdem: Beim Kauf von zwei T-Shirts bekommen Sie das dritte gratis! Die Angebote gelten nur bis Samstag. Öffnungszeiten: Montag bis Freitag 9-20 Uhr, Samstag 9-18 Uhr.",
      time: 180,
      questions: [
        { question: "Wie viel Rabatt gibt es auf Winterjacken?", options: ["30%", "40%", "50%"], correctIndex: 1 },
        { question: "Was kosten die Sportschuhe im Angebot?", options: ["39,99€", "49,99€", "59,99€"], correctIndex: 1 },
        { question: "Bis wann gelten die Angebote?", options: ["Freitag", "Samstag", "Sonntag"], correctIndex: 1 },
        { question: "Wann schließt das Kaufhaus am Samstag?", options: ["17 Uhr", "18 Uhr", "20 Uhr"], correctIndex: 1 },
      ],
    }],
  };

  let totalPassages = 0;
  for (const ch of chapters) {
    const chapter = await prisma.chapter.findUnique({ where: { slug: ch.slug } });
    if (!chapter) continue;
    const passages = readingData[ch.slug];
    if (!passages) continue;

    for (const p of passages) {
      const existing = await prisma.readingPassage.findFirst({
        where: { titleDe: p.titleDe, chapterId: chapter.id },
      });
      if (!existing) {
        await prisma.readingPassage.create({
          data: {
            titleDe: p.titleDe, titleEn: p.titleEn, contentDe: p.content,
            questions: JSON.stringify(p.questions),
            timeLimitSeconds: p.time, chapterId: chapter.id,
          },
        });
        totalPassages++;
      }
    }
  }
  console.log(`  Reading: ${totalPassages} passages`);

  // --- Listening Exercises ---
  const listeningData: Record<number, { titleDe: string; titleEn: string; youtubeUrl: string; questions: { question: string; options: string[]; correctIndex: number }[] }[]> = {
    1: [
      {
        titleDe: "Begrüßung und Vorstellung",
        titleEn: "Greeting and Introduction",
        youtubeUrl: "https://www.youtube.com/watch?v=0gNauGGe7I4",
        questions: [
          { question: "Wie heißt die Frau?", options: ["Anna", "Maria", "Lisa"], correctIndex: 0 },
          { question: "Woher kommt sie?", options: ["Berlin", "München", "Hamburg"], correctIndex: 1 },
          { question: "Was macht sie beruflich?", options: ["Lehrerin", "Ärztin", "Studentin"], correctIndex: 2 },
        ],
      },
    ],
    2: [
      {
        titleDe: "Beim Einkaufen",
        titleEn: "At the Store",
        youtubeUrl: "https://www.youtube.com/watch?v=M7SVxif0Fxs",
        questions: [
          { question: "Was kauft der Mann?", options: ["Brot", "Milch", "Äpfel"], correctIndex: 0 },
          { question: "Wie viel kostet es?", options: ["2 Euro", "3 Euro", "5 Euro"], correctIndex: 1 },
          { question: "Wo ist der Supermarkt?", options: ["Am Bahnhof", "In der Stadtmitte", "Neben der Post"], correctIndex: 2 },
        ],
      },
    ],
    3: [
      {
        titleDe: "Im Restaurant bestellen",
        titleEn: "Ordering at a Restaurant",
        youtubeUrl: "https://www.youtube.com/watch?v=G5kYzmcSn_E",
        questions: [
          { question: "Was bestellt die Frau?", options: ["Suppe", "Salat", "Schnitzel"], correctIndex: 2 },
          { question: "Was trinkt der Mann?", options: ["Wasser", "Bier", "Kaffee"], correctIndex: 0 },
          { question: "Wie schmeckt das Essen?", options: ["Schlecht", "Okay", "Sehr gut"], correctIndex: 2 },
        ],
      },
    ],
    5: [
      {
        titleDe: "Wegbeschreibung",
        titleEn: "Giving Directions",
        youtubeUrl: "https://www.youtube.com/watch?v=Qz0u08eQ6o4",
        questions: [
          { question: "Wohin will die Frau?", options: ["Zum Bahnhof", "Zur Post", "Zum Krankenhaus"], correctIndex: 0 },
          { question: "Wie weit ist es?", options: ["5 Minuten", "10 Minuten", "20 Minuten"], correctIndex: 1 },
          { question: "Was soll sie an der Ampel tun?", options: ["Geradeaus gehen", "Links abbiegen", "Rechts abbiegen"], correctIndex: 2 },
        ],
      },
    ],
    7: [
      {
        titleDe: "Arztbesuch und Gesundheit",
        titleEn: "Doctor Visit and Health",
        youtubeUrl: "https://www.youtube.com/watch?v=3jZ5vnY3kl0",
        questions: [
          { question: "Was hat der Patient?", options: ["Kopfschmerzen", "Bauchschmerzen", "Halsschmerzen"], correctIndex: 0 },
          { question: "Was soll er nehmen?", options: ["Tabletten", "Tee", "Nichts"], correctIndex: 0 },
          { question: "Wann soll er wiederkommen?", options: ["Morgen", "In einer Woche", "In einem Monat"], correctIndex: 1 },
        ],
      },
    ],
    10: [
      {
        titleDe: "Am Telefon",
        titleEn: "On the Phone",
        youtubeUrl: "https://www.youtube.com/watch?v=qYR8KSKMIjQ",
        questions: [
          { question: "Wer ruft an?", options: ["Ein Freund", "Der Chef", "Der Arzt"], correctIndex: 1 },
          { question: "Worum geht es?", options: ["Ein Termin", "Eine Einladung", "Eine Beschwerde"], correctIndex: 0 },
          { question: "Wann ist der Termin?", options: ["Montag", "Mittwoch", "Freitag"], correctIndex: 2 },
        ],
      },
    ],
  };

  let totalListening = 0;
  for (const [dayNum, exercises] of Object.entries(listeningData)) {
    const chapter = await prisma.chapter.findFirst({ where: { dayNumber: parseInt(dayNum) } });
    if (!chapter) continue;
    for (const ex of exercises) {
      const existing = await prisma.listeningExercise.findFirst({
        where: { titleDe: ex.titleDe, chapterId: chapter.id },
      });
      if (!existing) {
        await prisma.listeningExercise.create({
          data: {
            titleDe: ex.titleDe, titleEn: ex.titleEn,
            youtubeUrl: ex.youtubeUrl,
            questions: JSON.stringify(ex.questions),
            chapterId: chapter.id,
          },
        });
        totalListening++;
      }
    }
  }
  console.log(`  Listening: ${totalListening} exercises`);

  // --- Writing Prompts ---
  const writingData: Record<number, { type: string; promptDe: string; promptEn: string; modelAnswer: string; checklist: { label: string; hint: string }[] }[]> = {
    3: [{
      type: "email",
      promptDe: "Schreiben Sie eine E-Mail an einen Freund. Laden Sie ihn zum Abendessen ein. Nennen Sie: Datum, Uhrzeit, Ort und was Sie kochen möchten.",
      promptEn: "Write an email to a friend. Invite them to dinner. Include: date, time, place, and what you want to cook.",
      modelAnswer: "Lieber Thomas,\n\nwie geht es dir? Ich möchte dich gerne zum Abendessen einladen. Am Samstag, den 15. Juni, um 19 Uhr bei mir zu Hause. Ich koche Pasta mit Tomatensoße.\n\nKannst du kommen? Ich freue mich auf deine Antwort!\n\nViele Grüße,\nAnna",
      checklist: [
        { label: "Datum", hint: "Mention a specific date" },
        { label: "Uhr", hint: "Include a time" },
        { label: "einladen", hint: "Use invitation language" },
      ],
    }],
    6: [{
      type: "complaint",
      promptDe: "Schreiben Sie einen Beschwerdebrief an ein Hotel. Sie waren mit dem Zimmer nicht zufrieden. Beschreiben Sie: das Problem, was Sie erwarten und eine Lösung.",
      promptEn: "Write a complaint letter to a hotel. You were not satisfied with the room. Describe: the problem, what you expect, and a solution.",
      modelAnswer: "Sehr geehrte Damen und Herren,\n\nich war vom 10. bis 12. Juni in Ihrem Hotel (Zimmer 205). Leider war das Zimmer sehr laut und die Dusche hat nicht richtig funktioniert. Das Frühstück war kalt.\n\nIch bitte Sie um eine Erstattung von 50% des Zimmerpreises.\n\nMit freundlichen Grüßen,\nMax Müller",
      checklist: [
        { label: "Zimmer", hint: "Mention the room" },
        { label: "Problem", hint: "Describe the issue" },
        { label: "bitte", hint: "Make a polite request" },
      ],
    }],
    10: [{
      type: "letter",
      promptDe: "Schreiben Sie einen Brief an Ihren Vermieter. Bitten Sie um eine Reparatur in Ihrer Wohnung. Nennen Sie: was kaputt ist, seit wann, und wann Sie zu Hause sind.",
      promptEn: "Write a letter to your landlord. Ask for a repair in your apartment. Include: what is broken, since when, and when you are home.",
      modelAnswer: "Sehr geehrter Herr Schmidt,\n\nich schreibe Ihnen wegen einer Reparatur in meiner Wohnung. Seit zwei Wochen funktioniert die Heizung im Schlafzimmer nicht mehr. Es ist sehr kalt.\n\nIch bin am Montag und Mittwoch nachmittags zu Hause. Bitte schicken Sie einen Handwerker.\n\nMit freundlichen Grüßen,\nSarah Klein",
      checklist: [
        { label: "Reparatur", hint: "Mention the repair" },
        { label: "Wohnung", hint: "Reference the apartment" },
        { label: "Handwerker", hint: "Request a repairman" },
      ],
    }],
    15: [{
      type: "email",
      promptDe: "Schreiben Sie eine E-Mail an Ihren Kursleiter. Sie können nächste Woche nicht zum Deutschkurs kommen. Erklären Sie warum und fragen Sie nach den Hausaufgaben.",
      promptEn: "Write an email to your course instructor. You can't come to German class next week. Explain why and ask about homework.",
      modelAnswer: "Liebe Frau Müller,\n\nleider kann ich nächste Woche nicht zum Deutschkurs kommen, weil ich einen Arzttermin habe. Könnten Sie mir bitte die Hausaufgaben per E-Mail schicken?\n\nVielen Dank im Voraus!\n\nMit freundlichen Grüßen,\nAhmed Hassan",
      checklist: [
        { label: "Kurs", hint: "Mention the course" },
        { label: "Hausaufgaben", hint: "Ask about homework" },
        { label: "Entschuldigung", hint: "Include an apology/reason" },
      ],
    }],
  };

  let totalWriting = 0;
  for (const [dayNum, prompts] of Object.entries(writingData)) {
    const chapter = await prisma.chapter.findFirst({ where: { dayNumber: parseInt(dayNum) } });
    if (!chapter) continue;
    for (const p of prompts) {
      const existing = await prisma.writingPrompt.findFirst({
        where: { promptDe: p.promptDe, chapterId: chapter.id },
      });
      if (!existing) {
        await prisma.writingPrompt.create({
          data: {
            type: p.type, promptDe: p.promptDe, promptEn: p.promptEn,
            modelAnswer: p.modelAnswer,
            checklist: JSON.stringify(p.checklist),
            chapterId: chapter.id,
          },
        });
        totalWriting++;
      }
    }
  }
  console.log(`  Writing: ${totalWriting} prompts`);

  // --- Speaking Prompts ---
  const speakingData: Record<number, { type: string; promptDe: string; promptEn: string; keyPhrases: string[]; modelAnswer: string; time: number }[]> = {
    2: [{
      type: "monologue",
      promptDe: "Stellen Sie sich vor. Sagen Sie: Ihren Namen, woher Sie kommen, was Sie beruflich machen und was Ihr Hobby ist.",
      promptEn: "Introduce yourself. Say: your name, where you come from, your job, and your hobby.",
      keyPhrases: ["Ich heiße", "Ich komme aus", "Ich arbeite als", "Mein Hobby ist"],
      modelAnswer: "Ich heiße Anna und ich komme aus der Türkei. Ich lebe seit drei Jahren in Deutschland. Ich arbeite als Krankenschwester in einem Krankenhaus. Mein Hobby ist Kochen. Am Wochenende koche ich gerne türkische Gerichte für meine Freunde.",
      time: 120,
    }],
    5: [{
      type: "dialogue",
      promptDe: "Sie möchten einen Termin beim Arzt machen. Rufen Sie an und fragen Sie nach einem Termin. Sagen Sie, was Ihnen fehlt.",
      promptEn: "You want to make a doctor's appointment. Call and ask for an appointment. Say what's wrong.",
      keyPhrases: ["Ich möchte einen Termin", "Ich habe Schmerzen", "Wann ist ein Termin frei", "Vielen Dank"],
      modelAnswer: "Guten Tag, mein Name ist Max Schmidt. Ich möchte gerne einen Termin machen. Ich habe seit drei Tagen starke Kopfschmerzen. Wann ist ein Termin frei? Dienstag um 10 Uhr passt mir gut. Vielen Dank!",
      time: 120,
    }],
    8: [{
      type: "picture_description",
      promptDe: "Beschreiben Sie Ihren typischen Tag. Was machen Sie morgens, mittags und abends?",
      promptEn: "Describe your typical day. What do you do in the morning, afternoon, and evening?",
      keyPhrases: ["Morgens stehe ich auf", "Dann gehe ich", "Mittags esse ich", "Abends"],
      modelAnswer: "Morgens stehe ich um 7 Uhr auf und frühstücke. Dann gehe ich zur Arbeit mit der U-Bahn. Mittags esse ich in der Kantine. Nach der Arbeit gehe ich einkaufen. Abends koche ich und sehe fern.",
      time: 180,
    }],
    12: [{
      type: "monologue",
      promptDe: "Erzählen Sie von Ihrer letzten Reise. Wohin sind Sie gefahren? Was haben Sie gemacht? Wie war das Wetter?",
      promptEn: "Tell about your last trip. Where did you go? What did you do? How was the weather?",
      keyPhrases: ["Ich bin nach ... gefahren", "Das Wetter war", "Ich habe ... besucht", "Es hat mir gefallen"],
      modelAnswer: "Letzten Sommer bin ich nach Spanien gefahren. Das Wetter war sehr schön und warm. Ich habe den Strand besucht und viel geschwommen. Ich habe auch die Altstadt besichtigt. Es hat mir sehr gut gefallen!",
      time: 120,
    }],
  };

  let totalSpeaking = 0;
  for (const [dayNum, prompts] of Object.entries(speakingData)) {
    const chapter = await prisma.chapter.findFirst({ where: { dayNumber: parseInt(dayNum) } });
    if (!chapter) continue;
    for (const p of prompts) {
      const existing = await prisma.speakingPrompt.findFirst({
        where: { promptDe: p.promptDe, chapterId: chapter.id },
      });
      if (!existing) {
        await prisma.speakingPrompt.create({
          data: {
            type: p.type, promptDe: p.promptDe, promptEn: p.promptEn,
            keyPhrases: JSON.stringify(p.keyPhrases),
            modelAnswer: p.modelAnswer,
            timeLimitSeconds: p.time,
            chapterId: chapter.id,
          },
        });
        totalSpeaking++;
      }
    }
  }
  console.log(`  Speaking: ${totalSpeaking} prompts`);

  // --- Mock Tests ---
  const mockTestDays = [5, 10, 15, 20, 25, 28, 29, 30];
  let totalMockTests = 0;
  for (const day of mockTestDays) {
    const type = day >= 28 ? "full" : "mini";
    const sections = type === "full"
      ? [
          { name: "Lesen", questionCount: 15, timeLimitSeconds: 900 },
          { name: "Hören", questionCount: 10, timeLimitSeconds: 600 },
          { name: "Schreiben", questionCount: 2, timeLimitSeconds: 1200 },
          { name: "Wortschatz & Grammatik", questionCount: 20, timeLimitSeconds: 600 },
        ]
      : [
          { name: "Wortschatz", questionCount: 10, timeLimitSeconds: 300 },
          { name: "Grammatik", questionCount: 5, timeLimitSeconds: 180 },
          { name: "Lesen", questionCount: 5, timeLimitSeconds: 300 },
        ];

    const existing = await prisma.mockTest.findFirst({ where: { dayNumber: day } });
    if (!existing) {
      await prisma.mockTest.create({
        data: {
          dayNumber: day,
          type,
          sections: JSON.stringify(sections),
        },
      });
      totalMockTests++;
    }
  }
  console.log(`  Mock Tests: ${totalMockTests} tests`);

  const totalVerbs = Object.values(chapterVerbs).reduce((sum, v) => sum + v.length, 0);
  console.log(`\nSeeding complete: 30 chapters, 600 words, ${totalVerbs} verbs, ${totalRules} rules, ${totalExercises} exercises, ${totalPassages} reading passages, ${totalListening} listening, ${totalWriting} writing, ${totalSpeaking} speaking, ${totalMockTests} mock tests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
