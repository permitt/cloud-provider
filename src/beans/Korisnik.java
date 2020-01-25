package beans;

public class Korisnik {
    private String email;
    private String password;
    private String ime;
    private String prezime;
    private Organizacija organizacija;
    private String uloga;

    public Korisnik(String email, String password, String ime, String prezime, Organizacija organizacija, String uloga) {
        this.email = email;
        this.password = password;
        this.ime = ime;
        this.prezime = prezime;
        this.organizacija = organizacija;
        this.uloga = uloga;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public Organizacija getOrganizacija() {
        return organizacija;
    }

    public void setOrganizacija(Organizacija organizacija) {
        this.organizacija = organizacija;
    }

    public String getUloga() {
        return uloga;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }

}
