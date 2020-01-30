
package beans;

import java.util.ArrayList;

public class Organizacija {
	private String ime;
	private String opis;
	private String logo;
	private  ArrayList<Korisnik> korisnici;
	private  ArrayList<VM> resursi;
	
	public Organizacija() {
		this.ime= "NLB banka";
		this.korisnici = new ArrayList<>();
		this.resursi = new ArrayList<VM>();
	}
	
	public Organizacija(String ime, String opis, String logo, ArrayList<Korisnik> korisnici, ArrayList<VM> resursi) {
		super();
		this.ime = ime;
		this.opis = opis;
		this.logo = logo;
		this.korisnici = korisnici;
		this.resursi = resursi;

	}
	
	
	
	public String getIme() {
		return ime;
	}
	public void setIme(String ime) {
		this.ime = ime;
	}
	public String getOpis() {
		return opis;
	}
	public void setOpis(String opis) {
		this.opis = opis;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}
	public ArrayList<Korisnik> getKorisnici() {
		return korisnici;
	}
	public void setKorisnici(ArrayList<Korisnik> korisnici) {
		this.korisnici = korisnici;
	}
	public ArrayList<VM> getResursi() {
		return resursi;
	}
	public void setResursi(ArrayList<VM> resursi) {
		this.resursi = resursi;
	}

	public void dodajKorisnika(Korisnik k){
		if(this.korisnici.contains(k))
			return;
		this.korisnici.add(k);

	}
}
