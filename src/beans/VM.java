package beans;

import java.util.ArrayList;
import java.util.Date;

public class VM {
	private String ime;
	private KategorijaVM kategorija;
	private int brojJezgara;
	private int RAM;
	private int GPU;
	private ArrayList<Disk> diskovi;
	private String organizacija;
	private ArrayList<Aktivnost> listaAktivnosti;

	@Override
	public boolean equals(Object obj) {
		VM vm = (VM) obj;
		return this.getIme().equals(vm.getIme());
	}

	public VM() {
		
	}
	
	public VM(String ime, KategorijaVM kategorija, ArrayList<Disk> diskovi, String o,ArrayList<Aktivnost> ak) {
		super();
		this.ime = ime;
		this.kategorija = kategorija;
		this.diskovi = diskovi;
		this.GPU = this.kategorija.getGPU();
		this.brojJezgara = this.kategorija.getBrojJezgara();
		this.RAM = this.kategorija.getRAM();
		this.organizacija = o;
		this.listaAktivnosti = ak;
	}


	public void upali(){
		this.listaAktivnosti.add(new Aktivnost(new Date()));
	}

	public void ugasi(){
		Aktivnost ak = this.listaAktivnosti.get(this.listaAktivnosti.size()-1);
		ak.setUgasena(new Date());
	}
	
	public String getOrganizacija() {
		return organizacija;
	}

	public void setOrganizacija(String organizacija) {
		this.organizacija = organizacija;
	}

	public ArrayList<Aktivnost> getListaAktivnosti() {
		return listaAktivnosti;
	}

	public void setListaAktivnosti(ArrayList<Aktivnost> listaAktivnosti) {
		this.listaAktivnosti = listaAktivnosti;
	}

	public String getIme() {
		return ime;
	}
	public void setIme(String ime) {
		this.ime = ime;
	}
	public KategorijaVM getKategorija() {
		return kategorija;
	}
	public void setKategorija(KategorijaVM kategorija) {
		this.kategorija = kategorija;
		this.brojJezgara = kategorija.getBrojJezgara();
		this.setRAM(kategorija.getRAM());
		this.setGPU(kategorija.getGPU());
	}
	public int getBrojJezgara() {
		return brojJezgara;
	}
	public void setBrojJezgara(int brojJezgara) {
		this.brojJezgara = brojJezgara;
	}
	public int getRAM() {
		return RAM;
	}
	public void setRAM(int rAM) {
		RAM = rAM;
	}
	public int getGPU() {
		return GPU;
	}
	public void setGPU(int gPU) {
		GPU = gPU;
	}
	public ArrayList<Disk> getDiskovi() {
		return diskovi;
	}
	public void setDiskovi(ArrayList<Disk> diskovi) {
		this.diskovi = diskovi;
	}
}