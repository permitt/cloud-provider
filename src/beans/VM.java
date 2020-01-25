package beans;

import java.util.ArrayList;

public class VM {
	private String ime;
	private KategorijaVM kategorija;
	private int brojJezgara;
	private int RAM;
	private int GPU;
	private ArrayList<Disk> diskovi;
	
	public VM() {
		
	}
	
	public VM(String ime, KategorijaVM kategorija, ArrayList<Disk> diskovi) {
		super();
		this.ime = ime;
		this.kategorija = kategorija;
		this.diskovi = diskovi;
		this.GPU = this.kategorija.getGPU();
		this.brojJezgara = this.kategorija.getBrojJezgara();
		this.RAM = this.kategorija.getRAM();
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